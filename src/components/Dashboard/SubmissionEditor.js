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
import LoadingButton from '../FormControl/LoadingButton';
import ImageSelect from './ImageSelect';
import { rights } from '../../utils/rights';
import { stateToText } from '../../utils/draft-js-export-text';

import store from '../../store';

const TWITTER_LINK_LENGTH = 23;
const TWITTER_LIMIT = 280 - TWITTER_LINK_LENGTH - 1; // link + 1 space gets auto added to tweet
const DUMB_LINK_REGEX = /(?:^|\s)(https?:\/\/[^ ]+\.[^ ]+)/g;

function getTweetCharactersLeft(text) {
  if (!text) {
    return TWITTER_LIMIT;
  }
  let remaining = TWITTER_LIMIT - text.length;
  const match = text.match(DUMB_LINK_REGEX);
  if (match) {
    match.forEach((m) => {
      remaining = (remaining + m.trim().length) - TWITTER_LINK_LENGTH;
    });
  }
  return remaining;
}

const CONTENT_LIMIT = 1000;

function getContentCharactersLeft(text) {
  if (!text) {
    return CONTENT_LIMIT;
  }
  const plain = text
    .replace(/\[https?:\/\/.+?\]/g, '')
    .replace(/\s\s+/g, ' ');
  return CONTENT_LIMIT - plain.length;
}

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

function onRightsChange(value) {
  if (value.length <= 2) {
    onValueChange('rights')(value);
  }
}

function onImageChange(value, name) {
  onValueChange('imageURL')(value);
  onValueChange('imageName')(name);
}

class SubmissionEditor extends React.Component {
  state = {
    saveErrorText: null,
    editorText: 0,
    editorHtml: '',
    showRawHtml: false,
  };

  onRawClick = (event) => {
    event.preventDefault();
    this.setState(prevState => ({ showRawHtml: !prevState.showRawHtml }));
  }

  onRawHtmlChange = (event) => {
    const html = event.target.value;
    this.onEditorChange(html);
    this.editorValue = false;
    if (this.rte) {
      // eslint-disable-next-line no-underscore-dangle
      this.rte._currentValue = null;
      this.rte.forceUpdate();
    }
  }

  onEditorChange = (value, editorValue) => {
    this.editorValue = true;
    this.setState({ editorHtml: value });

    if (editorValue) {
      stateToText(editorValue.getEditorState().getCurrentContent())
        .then((text) => {
          this.setState({ editorText: text, saveErrorText: null });
          store.emit('editable:updateeditor', value, text);
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error('onEditorChange', error);
        });
    }
  }

  onSave = () => {
    if (getContentCharactersLeft(this.state.editorText) < 0) {
      this.setState({
        saveErrorText: 'Vsebina je predolga!',
      });
      return false;
    }
    store.emit('editable:save');
    return true;
  }

  onSaveClickedSuccess = () => {
    this.props.history.push('/dash');
  }

  renderAuthor() {
    const { entry, state } = this.props;
    let content = (
      <div>{entry.author_name || `Neznan avtor #${entry.author}`}</div>
    );
    if (state.user.data.group === 'admin') {
      content = (
        <div className="component__input component__input--select">
          <select id="submissioneditor-author" value={entry.author} className="form-control" onChange={onValueChange('author')}>
            {state.users.data.map(u => (
              <option key={u.id} value={u.id}>{`${u.name} (${u.username})`}</option>
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

  renderDate() {
    const { entry, state } = this.props;
    let content = (
      <div>{toSloDateString(entry.date)} (<TimeAgo date={entry.date} />)</div>
    );
    if (state.user.data.group === 'admin') {
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

  renderStatus() {
    const { entry, state } = this.props;
    let content = (
      <div>{TYPE_TEXT[entry.type]}</div>
    );
    if (state.user.data.group === 'admin') {
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

  render() {
    const { entry, state } = this.props;
    const {
      editorText,
      editorHtml,
      saveErrorText,
      showRawHtml,
    } = this.state;
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
                <label htmlFor="submissioneditor-tweet" className="control-label">Twitter ({getTweetCharactersLeft(entry.tweet)})</label>
                <Textarea
                  id="submissioneditor-tweet"
                  value={entry.tweet}
                  onChange={onValueChange('tweet')}
                  className="form-control overflow-hidden"
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
                {state.editable.autosave && (
                  <strong className="pull-right">Vključeno je samodejno shranjevanje!</strong>
                )}
                <input
                  id="submissioneditor-title"
                  placeholder="Dodaj naslov"
                  value={entry.title}
                  onChange={onValueChange('title')}
                  className="form-control"
                />
              </div>
              <div className="form-group theeditor">
                <label htmlFor="submissioneditor-content" className="control-label">Vsebina ({getContentCharactersLeft(editorText)})</label>
                <a className="small pull-right" href="#" onClick={this.onRawClick}>raw html</a>
                {showRawHtml && (
                  <Textarea value={editorHtml} onChange={this.onRawHtmlChange} className="form-control" />
                )}
                <SimpleRichTextEditor
                  format="html"
                  value={this.editorValue || editorHtml || entry.content}
                  onChange={this.onEditorChange}
                  ref={(e) => { this.rte = e; }}
                />
              </div>
              <div className="form-group">
                <label htmlFor="submissioneditor-rights" className="control-label">Pravice</label>
                <Select
                  isMulti
                  id="submissioneditor-rights"
                  classNamePrefix="react-select"
                  name="rights"
                  value={entry.rights.split(',').map(r => rights.find(e => e.value === r))}
                  options={rights}
                  onChange={onRightsChange}
                  placeholder="Izberi eno ali dve pravici"
                />
              </div>
            </section>
            <section className="row">
              <div className="col-sm-6">
                <div className="form-group">
                  <label className="control-label">Slika</label>
                  <ImageSelect onChange={onImageChange} />
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
              </div>
              <div className="col-sm-6">
                <label className="control-label">Predogled</label>
                {entry.imageURL && <img className="img-responsive img-fullwidth thumbnail" src={entry.imageURL} alt="preview" />}
              </div>
            </section>
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
            <div className="col-sm-12 text-center">
              {saveErrorText && (
                <strong>{saveErrorText}</strong>
              )}
            </div>
            <div className="col-sm-4 col-sm-offset-4">
              <LoadingButton
                block
                values={['Shrani', 'Shranjujem...', 'Shranjeno :)', 'Napaka :(']}
                className="pull-right"
                loading={state.editable.saving}
                error={state.editable.savingError}
                onClick={this.onSave}
                onSuccess={this.onSaveClickedSuccess}
              />
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
  state: PropTypes.shape().isRequired,
  history: PropTypes.shape().isRequired,
};

export default withRouter(SubmissionEditor);
