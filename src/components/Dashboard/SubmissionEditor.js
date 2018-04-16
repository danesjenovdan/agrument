import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import _ from 'lodash';
import { withRouter } from 'react-router-dom';
import SimpleRichTextEditor from '../SimpleRichTextEditor';
import { toSloDateString } from '../../utils/date';
import TimeAgo from '../LocalizedTimeAgo';
import Checkbox from '../FormControl/Checkbox';
import ImageEdit from './ImageEdit';
import { rights } from '../../utils/rights';
import stateToText from '../../utils/draft-js-export-text';

import store from '../../store';

function onValueChange(key) {
  return (event) => {
    let value = event;
    if (event.target) {
      value = event.target.type === 'checkbox' ? Number(event.target.checked) : event.target.value;
    } else if (_.isArray(value)) {
      value = value.map(e => e.value).join(',');
    }
    store.emit('editor:updateeditor', key, value);
  };
}

function onBeforeUnload(event) {
  event.returnValue = 'Changes you made may not be saved.'; // eslint-disable-line no-param-reassign
}

class SubmissionEditor extends React.Component {
  componentDidMount() {
    window.addEventListener('beforeunload', onBeforeUnload);
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', onBeforeUnload);
  }

  onRTEChange = (value, editorValue) => {
    // console.log(stateToText(editorValue.getEditorState().getCurrentContent()));
    store.emit('editor:updateeditor-rte', value);
    this.content = value;
  }

  render() {
    const { entry } = this.props;
    return (
      <article className="component__submission-editor">
        <section className="row clearfix">
          <div className="col-sm-6">
            <div>
              <strong>Deadline: </strong>
              <span>
                {toSloDateString(entry.deadline)} (<TimeAgo date={entry.deadline} />)
          </span>
            </div>
          </div>
          <div className="col-sm-6">
            <div>
              <strong>Avtor: </strong>
              <span>
                {entry.author_name || `Neznan avtor #${entry.author}`}
              </span>
            </div>
          </div>
          <div className="col-sm-12">
            <div>
              <strong>Pravice: </strong>
              <span>
                <Select
                  multi
                  name="rights"
                  value={entry.rights}
                  options={rights}
                  onChange={onValueChange('rights')}
                  placeholder="Izberi eno ali dve pravici"
                />
              </span>
            </div>
          </div>
        </section>
        <hr />
        <section>
          <h3>
            <input
              placeholder="Dodaj naslov"
              value={entry.title}
              onChange={onValueChange('title')}
              className="form-control"
            />
          </h3>
          <div className="form-group theeditor">
            <SimpleRichTextEditor
              format="html"
              value={this.content || entry.content}
              onChange={this.onRTEChange}
            />
          </div>
        </section>
        <section>
          <div>
            <Checkbox
              label="Uporabi posebni embed"
              checked={!!entry.hasEmbed}
              onChange={onValueChange('hasEmbed')}
            />
          </div>
          {!!entry.hasEmbed && (
            <textarea
              placeholder="Prilepi embed kodo"
              value={entry.embedCode || ''}
              onChange={onValueChange('embedCode')}
              className="form-control"
            />
          )}
        </section>
        <hr />
        <section className="row clearfix">
          <div className="col-sm-3 og-description-container">
            <strong>og description: </strong>
          </div>
          <div className="col-sm-9 og-description-container">
            <input
              value={entry.description}
              onChange={onValueChange('description')}
              className="form-control"
            />
          </div>
          <div>
            <div className="col-sm-3 og-image-container">
              <strong>og image: </strong>
            </div>
            <div className="col-sm-9 og-image-container">
              <ImageEdit onDone={onValueChange('imageURL')} />
            </div>
          </div>
          <div className="col-sm-3 og-caption-container">
            <strong>caption: </strong>
          </div>
          <div className="col-sm-9 og-caption-container">
            <input
              value={entry.imageCaption}
              onChange={onValueChange('imageCaption')}
              className="form-control"
            />
          </div>
        </section>
      </article >
    );
  }
}

SubmissionEditor.propTypes = {
  entry: PropTypes.shape({
    id: PropTypes.number.isRequired,
    date: PropTypes.number.isRequired,
    author: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    imageURL: PropTypes.string.isRequired,
    imageCaption: PropTypes.string.isRequired,
    hasEmbed: PropTypes.number.isRequired,
    embedCode: PropTypes.string,
    embedHeight: PropTypes.string,
    deadline: PropTypes.number.isRequired,
    rights: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    author_name: PropTypes.string,
  }).isRequired,
};

export default withRouter(SubmissionEditor);
