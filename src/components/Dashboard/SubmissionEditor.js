import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import _ from 'lodash';
import { withRouter } from 'react-router-dom';
import Textarea from 'react-textarea-autosize';
import SimpleRichTextEditor from '../SimpleRichTextEditor';
import DatePicker from '../DatePicker';
import { toSloDateString, parseDate } from '../../utils/date';
import TimeAgo from '../LocalizedTimeAgo';
import Button from '../FormControl/Button';
import ImageEdit from './ImageEdit';
import { rights } from '../../utils/rights';
import { stateToText } from '../../utils/draft-js-export-text';

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
    } else if (_.isDate(value)) {
      const date = parseDate(value, false);
      value = date.getTime();
    }
    store.emit('editable:update', key, value);
  };
}

function onSave() {
  store.emit('editable:save');
}

class SubmissionEditor extends React.Component {
  onEditorChange = (value, editorValue) => {
    this.editorValue = true;
    const text = stateToText(editorValue.getEditorState().getCurrentContent());
    store.emit('editable:updateeditor', value, text);
  }

  renderAuthor() {
    const { entry, user, users } = this.props;
    let content = entry.author_name || `Neznan avtor #${entry.author}`;
    if (user.group === 'admin') {
      content = (
        <div className="component__input component__input--select">
          <select id="submissioneditor-author" value={entry.author} className="form-control" onChange={onValueChange('author')}>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
          <span><i className="glyphicon glyphicon-chevron-down" /></span>
        </div>
      );
    }
    return (
      <div className="form-group">
        <label htmlFor="submissioneditor-author" className="control-label">Avtor</label>
        {content}
      </div>
    );
  }

  renderStatus() {
    const { entry, user } = this.props;
    let content = TYPE_TEXT[entry.type];
    if (user.group === 'admin') {
      content = (
        <div className="component__input component__input--select">
          <select id="submissioneditor-type" value={entry.type} className="form-control" onChange={onValueChange('type')}>
            {Object.keys(TYPE_TEXT).map(type => (
              <option key={type} value={type}>{TYPE_TEXT[type]}</option>
            ))}
          </select>
          <span><i className="glyphicon glyphicon-chevron-down" /></span>
        </div>
      );
    }
    return (
      <div className="form-group">
        <label htmlFor="submissioneditor-type" className="control-label">Stanje</label>
        {content}
      </div>
    );
  }

  renderDate() {
    const { entry, user } = this.props;
    let content = (
      <span>{toSloDateString(entry.date)} (<TimeAgo date={entry.date} />)</span>
    );
    if (user.group === 'admin') {
      content = (
        <DatePicker locale="sl-SI" value={new Date(entry.date)} onChange={onValueChange('date')} />
      );
    }
    return (
      <div className="form-group">
        <label htmlFor="submissioneditor-date" className="control-label">Datum</label>
        {content}
      </div>
    );
  }

  render() {
    const { entry, user } = this.props;
    // console.log(user.id, entry.author);
    return (
      <div className="row">
        <div className="col-md-4">
          <div className="component__submission-editor">
            <div>
              {this.renderAuthor()}
              {this.renderDate()}
              {this.renderStatus()}
              <div className="form-group">
                <label htmlFor="submissioneditor-tweet" className="control-label">Twitter</label>
                <Textarea
                  id="submissioneditor-tweet"
                  value={entry.tweet}
                  onChange={onValueChange('tweet')}
                  className="form-control overflow-hidden"
                  maxLength="240"
                />
              </div>
              <div className="form-group">
                <label htmlFor="submissioneditor-fbtext" className="control-label">Facebook</label>
                <Textarea
                  readOnly
                  id="submissioneditor-fbtext"
                  value={entry.fbtext}
                  onChange={onValueChange('fbtext')}
                  className="form-control overflow-hidden"
                />
              </div>
              <div className="form-group">
                <label htmlFor="submissioneditor-ogdesc" className="control-label">og opis</label>
                <Textarea
                  readOnly
                  id="submissioneditor-ogdesc"
                  value={entry.description}
                  onChange={onValueChange('description')}
                  className="form-control overflow-hidden"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <article className="component__submission-editor">
            <section>
              <div className="form-group">
                <label htmlFor="submissioneditor-title" className="control-label">Naslov</label>
                <input
                  id="submissioneditor-title"
                  placeholder="Dodaj naslov"
                  value={entry.title}
                  onChange={onValueChange('title')}
                  className="form-control"
                />
              </div>
              <div className="form-group theeditor">
                <label htmlFor="submissioneditor-content" className="control-label">Vsebina</label>
                <SimpleRichTextEditor
                  format="html"
                  value={this.editorValue || entry.content}
                  onChange={this.onEditorChange}
                />
              </div>
            </section>
            <div className="form-group">
              <label htmlFor="submissioneditor-rights" className="control-label">Pravice</label>
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
          </article>
          <div className="row">
            <div className="col-sm-4 col-sm-offset-4">
              <Button block value="Shrani" className="pull-right" disabled={entry.disabled} onClick={onSave} />
            </div>
          </div>
        </div>
      </div>
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
    imageCaptionURL: PropTypes.string.isRequired,
    // hasEmbed: PropTypes.number.isRequired,
    // embedCode: PropTypes.string,
    // embedHeight: PropTypes.string, // TODO:
    rights: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    author_name: PropTypes.string,
  }).isRequired,
  user: PropTypes.shape().isRequired,
  users: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export default withRouter(SubmissionEditor);
