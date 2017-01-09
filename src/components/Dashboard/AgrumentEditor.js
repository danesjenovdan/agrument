import React, { PropTypes } from 'react';
import Select from 'react-select';
import RichTextEditor from 'react-rte';
import { autobind } from 'core-decorators';
import moment from 'moment';
import Checkbox from '../FormControl/Checkbox';
import Button from '../FormControl/Button';
import ImageEdit from './ImageEdit';

moment.locale('sl');

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
      moment: moment(props.data.deadline),
      content: RichTextEditor.createValueFromString(props.data.content, 'html'),
      data: props.data,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ data: nextProps.data });
  }

  @autobind
  onHasEmbedChange(event) {
    this.state.data.hasEmbed = event.target.checked;
    this.setState({ data: this.state.data });
  }

  @autobind
  onRightsChange(value) {
    this.state.data.rights = value;
    this.setState({ data: this.state.data });
  }

  @autobind
  onContentChange(value) {
    this.setState({ content: value });
  }

  @autobind
  onImageChange(value) {
    this.state.data.image = value;
    this.setState({ data: this.state.data });
  }


  @autobind
  onSubmitAgrument(event) {
    this.setState({ loading: true });
    event.preventDefault();
    console.log('submit');
    // TODO: post as json?
    // content.toString('html');
  }

  render() {
    return (
      <div className="component__agrument-editor">
        <p className="lead">Deadline: {this.state.moment.format('l')} - {this.state.moment.fromNow()}!</p>
        <form action="https://httpbin.org/get" onSubmit={this.onSubmitAgrument}>
          <div className="form-group">
            <input className="form-control" name="title" placeholder="Naslov agrumenta" defaultValue={this.state.data.title} />
          </div>
          <div className="form-group">
            <RichTextEditor
              value={this.state.content}
              onChange={this.onContentChange}
            />
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
              <Checkbox label="Uporabi posebni embed" onChange={this.onHasEmbedChange} checked={this.state.data.hasEmbed} />
            </div>
            <div className="clearfix" />
          </div>
          {this.state.data.hasEmbed ? <div className="form-group">
            <textarea className="form-control" placeholder="Prilepi embed kodo" defaultValue={this.state.data.embedCode} />
          </div> : null}
          <Button block value="Oddaj" />
        </form>
      </div>
    );
  }
}

AgrumentEditor.propTypes = {
  data: PropTypes.shape(),
};

export default AgrumentEditor;
