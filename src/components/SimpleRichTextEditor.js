import React from 'react';
import RichTextEditor from './RichTextEditor';

/* eslint-disable no-underscore-dangle, react/prop-types */
export default class SimpleRichTextEditor extends React.Component {
  constructor(...args) {
    super(...args);

    this.state = {
      editorValue: RichTextEditor && RichTextEditor.createEmptyValue(),
    };
  }

  componentWillMount() {
    this._updateStateFromProps(this.props);
  }

  componentWillReceiveProps(newProps) {
    this._updateStateFromProps(newProps);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.editorValue !== nextState.editorValue) {
      return true;
    }
    if (this.props.onChange !== nextProps.onChange) {
      return true;
    }
    if (this.props.value !== nextProps.value) {
      return true;
    }
    if (this.props.format !== nextProps.format) {
      return true;
    }
    return false;
  }

  _updateStateFromProps = (newProps) => {
    const { value, format, onChange } = newProps;
    if (this._currentValue != null) {
      const [currentValue, currentFormat] = this._currentValue;
      if (format === currentFormat && value === currentValue) {
        return;
      }
    }
    if (value !== true) {
      const { editorValue } = this.state;
      let newEditorValue = null;
      if (typeof value === 'string') {
        newEditorValue = editorValue.setContentFromString(value, format);
      } else if (value != null) {
        newEditorValue = value;
      }
      if (newEditorValue != null) {
        if (editorValue !== newEditorValue) {
          this.setState({
            editorValue: newEditorValue,
          });
        }
        if (this._currentValue == null) {
          const stringValue = newEditorValue.toString(format);
          if (onChange) {
            onChange(stringValue, newEditorValue);
          }
        }
      }
    }
    this._currentValue = [format, value];
  }

  _onChange = (editorValue) => {
    const { format, onChange } = this.props;
    const oldEditorValue = this.state.editorValue;
    this.setState({ editorValue });
    const oldContentState = oldEditorValue
      ? oldEditorValue.getEditorState().getCurrentContent()
      : null;
    const newContentState = editorValue.getEditorState().getCurrentContent();
    if (oldContentState !== newContentState) {
      const stringValue = editorValue.toString(format);
      // Optimization so if we receive new props we don't need
      // to parse anything unnecessarily.
      this._currentValue = [format, stringValue];
      if (onChange && stringValue !== this.props.value) {
        onChange(stringValue, editorValue);
      }
    }
  }

  render() {
    if (RichTextEditor) {
      const { value, ...otherProps } = this.props;
      const toolbarConfig = {
        display: ['INLINE_STYLE_BUTTONS', 'LINK_BUTTONS', 'HISTORY_BUTTONS'],
        INLINE_STYLE_BUTTONS: [
          { label: 'Italic', style: 'ITALIC' },
        ],
      };
      return (
        <RichTextEditor
          {...otherProps}
          value={this.state.editorValue}
          onChange={this._onChange}
          toolbarConfig={toolbarConfig}
        />
      );
    }
    return <div />;
  }
}
