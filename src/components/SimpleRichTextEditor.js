import React from 'react';
import { filterEditorState } from 'draftjs-filters';
import RichTextEditor from './RichTextEditor';

function openLinksInNewTab(editorState) {
  const content = editorState.getCurrentContent();
  const blockMap = content.getBlockMap();

  const blocks = blockMap.map((block) => {
    let altered = false;

    const chars = block.getCharacterList().map((char) => {
      const entKey = char.getEntity();
      if (entKey != null) {
        const ent = content.getEntity(entKey);
        if (ent.getType() === 'LINK') {
          const linkData = ent.getData();
          if (!linkData.target) {
            linkData.target = '_blank';
            altered = true;
          }
        }
      }
      return char;
    });

    return altered ? block.set('characterList', chars) : block;
  });

  const nextContent = content.merge({
    blockMap: blockMap.merge(blocks),
  });

  return editorState.constructor.set(editorState, {
    currentContent: nextContent,
  });
}

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

  _onChange = (nextEditorValue) => {
    const { format, onChange } = this.props;
    const { editorValue } = this.state;

    let filteredState = nextEditorValue.getEditorState();

    const shouldFilterPaste = (
      filteredState.getCurrentContent() !== editorValue.getEditorState().getCurrentContent()
      && filteredState.getLastChangeType() === 'insert-fragment'
    );

    if (shouldFilterPaste) {
      filteredState = filterEditorState(
        {
          blocks: [],
          styles: ['ITALIC', 'BOLD', 'UNDERLINE'],
          entities: [{
            type: 'LINK',
            attributes: ['target', 'url'],
            whitelist: {
              url: '^https?://',
            },
          }],
          maxNesting: 1,
          whitespacedCharacters: ['\n', '\t'],
        },
        filteredState,
      );
    }

    filteredState = openLinksInNewTab(filteredState);

    // eslint-disable-next-line no-param-reassign
    nextEditorValue = nextEditorValue.setEditorState(filteredState);

    this.setState({ editorValue: nextEditorValue });
    const oldContentState = editorValue
      ? editorValue.getEditorState().getCurrentContent()
      : null;
    const newContentState = nextEditorValue.getEditorState().getCurrentContent();
    if (oldContentState !== newContentState) {
      const stringValue = nextEditorValue.toString(format);
      // Optimization so if we receive new props we don't need
      // to parse anything unnecessarily.
      this._currentValue = [format, stringValue];
      if (onChange && stringValue !== this.props.value) {
        onChange(stringValue, nextEditorValue);
      }
    }
  }

  render() {
    if (RichTextEditor) {
      const { value, ...otherProps } = this.props;
      const toolbarConfig = {
        display: ['INLINE_STYLE_BUTTONS', 'LINK_BUTTONS', 'HISTORY_BUTTONS'],
        INLINE_STYLE_BUTTONS: [
          { label: 'Bold', style: 'BOLD' },
          { label: 'Italic', style: 'ITALIC' },
          { label: 'Underline', style: 'UNDERLINE' },
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
