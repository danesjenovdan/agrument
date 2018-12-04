import React from 'react';

let ReactQuill = null; // eslint-disable-line import/no-mutable-exports
if (process.env.BROWSER) {
  ReactQuill = require('react-quill').default; // eslint-disable-line global-require
}

class SimpleQuillEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = { text: '' };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(value) {
    this.setState({ text: value });
  }

  render() {
    if (ReactQuill) {
      return <ReactQuill value={this.state.text} onChange={this.handleChange} />;
    }
    return <div />;
  }
}

export default SimpleQuillEditor;
