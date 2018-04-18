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

const TYPE_TEXT = {
  published: 'Objavljen',
  votable: 'Na glasovanju',
  pending: 'Čaka na oddajo',
};

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

class SubmissionEditor extends React.Component {
  onRTEChange = (value, editorValue) => {
    // console.log(stateToText(editorValue.getEditorState().getCurrentContent()));
    store.emit('editor:updateeditor-rte', value);
    this.content = value;
  }

  render() {
    const { entry } = this.props;
    return (
      <article className="component__submission-editor">
        <div className="form-horizontal">
          <div className="form-group">
            <strong className="col-sm-2 text-right">Datum</strong>
            <div className="col-sm-4">
              {toSloDateString(entry.date)} (<TimeAgo date={entry.date} />)
            </div>
            <strong className="col-sm-2 text-right">Avtor</strong>
            <div className="col-sm-4">
              {entry.author_name || `Neznan avtor #${entry.author}`}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="submissioneditor-rights" className="col-sm-2 control-label">Pravice</label>
            <div className="col-sm-10">
              <Select
                multi
                id="submissioneditor-rights"
                name="rights"
                value={entry.rights}
                options={rights}
                onChange={onValueChange('rights')}
                placeholder="Izberi eno ali dve pravici"
              />
            </div>
          </div>
          <div className="form-group">
            <strong className="col-sm-2 text-right">Stanje</strong>
            <div className="col-sm-10">
              {TYPE_TEXT[entry.type]}
            </div>
          </div>
        </div>
        <hr />
        <section>
          <h3 className="form-group form-group-lg">
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
        <hr />
        <div className="form-group">
          <label htmlFor="submissioneditor-ogdesc" className="control-label">Opis za og</label>
          <input
            id="submissioneditor-ogdesc"
            value={entry.description}
            onChange={onValueChange('description')}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label className="control-label">Slika</label>
          <ImageEdit onDone={onValueChange('imageURL')} />
        </div>
        <div className="form-group">
          <label htmlFor="submissioneditor-imgcap" className="control-label">Vir slike (Opis)</label>
          <input
            id="submissioneditor-imgcap"
            value={entry.imageCaption}
            onChange={onValueChange('imageCaption')}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="submissioneditor-imgcapurl" className="control-label">Vir slike (URL)</label>
          <input
            id="submissioneditor-imgcapurl"
            value={entry.imageCaptionURL}
            onChange={onValueChange('imageCaptionURL')}
            className="form-control"
          />
        </div>
        {/* <section>
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
        </section> */}
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
    imageCaptionURL: PropTypes.string.isRequired, // TODO:
    // hasEmbed: PropTypes.number.isRequired,
    // embedCode: PropTypes.string, // TODO:
    // embedHeight: PropTypes.string, // TODO:
    rights: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    author_name: PropTypes.string,
  }).isRequired,
};

export default withRouter(SubmissionEditor);
