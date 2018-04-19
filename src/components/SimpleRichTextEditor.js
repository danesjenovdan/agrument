import React from 'react';
import RichTextEditor from './RichTextEditor';

const MAX_LENGTH = 1000;

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

  _updateStateFromProps = (newProps) => {
    const { value, format } = newProps;
    if (this._currentValue != null) {
      const [currentValue, currentFormat] = this._currentValue;
      if (format === currentFormat && value === currentValue) {
        return;
      }
    }
    if (typeof value === 'string') {
      const { editorValue } = this.state;
      this.setState({
        editorValue: editorValue.setContentFromString(value, format),
      });
    } else if (value != null) {
      this.setState({
        editorValue: value,
      });
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

  _handleBeforeInput = () => {
    const currentContent = this.state.editorValue._editorState.getCurrentContent();
    const currentContentLength = currentContent.getPlainText('').length;

    if (currentContentLength > MAX_LENGTH - 1) {
      return 'handled';
    }

    return undefined;
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
      console.log('render');
      return (
        <RichTextEditor
          {...otherProps}
          value={this.state.editorValue}
          onChange={this._onChange}
          handleBeforeInput={this._handleBeforeInput}
          toolbarConfig={toolbarConfig}
        />
      );
    }
    return <div />;
  }
}
