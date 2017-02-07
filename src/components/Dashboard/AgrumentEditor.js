import React, { PropTypes } from 'react';
import Select from 'react-select';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import RichTextEditor from '../RichTextEditor';
import Checkbox from '../FormControl/Checkbox';
import ImageEdit from './ImageEdit';
import LocalizedTimeAgo from '../LocalizedTimeAgo';
import { editPending } from '../../utils/dash';

const rights = [
  { value: 'ena', label: 'One' },
  { value: 'dve', label: 'Two' },
  { value: 'tri', label: 'Three' },
  { value: 'stiri', label: 'Four' },
  { value: 'pet', label: 'Five' },
];

class AgrumentEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      content: RichTextEditor ? RichTextEditor.createValueFromString(props.data.content, 'html') : '',
      data: props.data,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ data: nextProps.data });
  }

  @autobind
  onTitleChange(event) {
    this.state.data.title = event.target.value;
    this.setState({ data: this.state.data });
  }

  @autobind
  onContentChange(value) {
    this.setState({ content: value });
  }

  @autobind
  onRightsChange(value) {
    let rightsString = value;
    if (_.isArray(rightsString)) {
      rightsString = rightsString.map(e => e.value).join(',');
    }
    this.state.data.rights = rightsString;
    this.setState({ data: this.state.data });
  }

  @autobind
  onImageChange(value) {
    this.state.data.image = value;
    this.setState({ data: this.state.data });
  }

  @autobind
  onHasEmbedChange(event) {
    this.state.data.hasEmbed = event.target.checked;
    this.setState({ data: this.state.data });
  }

  @autobind
  onEmbedCodeChange(event) {
    this.state.data.embedCode = event.target.value;
    this.setState({ data: this.state.data });
  }

  @autobind
  onSubmitAgrument(event) {
    event.preventDefault();
    this.save();
  }

  save(callback) {
    const content = this.state.content.toString('html');
    this.state.data.content = content;

    const data = {
      title: this.state.data.title,
      content,
      image: this.state.data.image,
      rights: this.state.data.rights,
      hasEmbed: this.state.data.hasEmbed,
      embedCode: this.state.data.embedCode,
    };

    editPending(this.state.data.id, data)
      .end((err, res) => {
        if (callback) {
          callback(err, res);
        }
      });
  }

  render() {
    return (
      <div className="component__agrument-editor">
        <p className="lead">Deadline: <LocalizedTimeAgo date={this.state.data.deadline} /></p>
        <form action="https://httpbin.org/get" onSubmit={this.onSubmitAgrument}>
          <div className="form-group">
            <input
              className="form-control"
              name="title"
              placeholder="Naslov agrumenta"
              defaultValue={this.state.data.title}
              onChange={this.onTitleChange}
            />
          </div>
          <div className="form-group">
            {RichTextEditor ? (
              <RichTextEditor value={this.state.content} onChange={this.onContentChange} />
            ) : null}
          </div>
          <div className="form-group">
            <Select
              multi
              name="rights"
              value={this.state.data.rights}
              options={rights}
              onChange={this.onRightsChange}
              placeholder="Izberi eno ali dve pravici"
            />
          </div>
          {this.state.data.image ? (
            <div className="form-group text-center">
              <img src={this.state.data.image} alt="og" className="img-responsive img-thumbnail" />
            </div>
          ) : null}
          <div className="form-group">
            <div className="col-sm-6">
              <ImageEdit onDone={this.onImageChange} />
            </div>
            <div className="col-sm-6">
              <Checkbox label="Uporabi posebni embed" onChange={this.onHasEmbedChange} checked={!!this.state.data.hasEmbed} />
            </div>
            <div className="clearfix" />
          </div>
          {this.state.data.hasEmbed ? (
            <div className="form-group">
              <textarea className="form-control" placeholder="Prilepi embed kodo" defaultValue={this.state.data.embedCode} onChange={this.onEmbedCodeChange} />
            </div>
          ) : null}
        </form>
      </div>
    );
  }
}

AgrumentEditor.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.number,
    deadline: PropTypes.number,
    author: PropTypes.number,
    title: PropTypes.string,
    content: PropTypes.string,
    image: PropTypes.string,
    rights: PropTypes.string,
    hasEmbed: PropTypes.number,
    embedCode: PropTypes.string,
  }).isRequired,
};

export default AgrumentEditor;
