import React from 'react';
import PropTypes from 'prop-types';
import { toSloDateString } from '../../utils/date';
import TimeAgo from '../LocalizedTimeAgo';
import { getRightFromLetter } from '../../utils/rights';

const SubmissionPreview = ({ entry }) => (
  <article className="component__submission-preview">
    <section className="row clearfix">
      <div className="col-sm-12">
        <p className="lead">
          <strong>Datum: </strong>
          <span>{toSloDateString(entry.date)} (<TimeAgo date={entry.date} />)</span>
        </p>
      </div>
      <div className="col-sm-12">
        <div>
          <strong>Pravice: </strong>
          <span>
            {entry.rights.split(',').map(getRightFromLetter).join(', ')}
          </span>
        </div>
      </div>
      <div className="col-sm-6">
        <div>
          <strong>Avtor: </strong>
          <span>{entry.author_name || `Neznan avtor #${entry.author}`}</span>
        </div>
      </div>
    </section>
    <section className="row">
      <div className="col-sm-12">
        <h2>{entry.title}</h2>
      </div>
      <div className="col-sm-12">
        {entry.imageURL && <img className="img-responsive thumbnail" style={{ marginLeft: 'auto', marginRight: 'auto', maxHeight: 300 }} src={entry.imageURL} alt="preview" />}
        <div className="text-right">
          <strong><a href={entry.imageCaptionURL} target="_blank" rel="noopener noreferrer">{entry.imageCaption}</a></strong>
        </div>
      </div>
    </section>
    <section className="row">
      <div className="col-sm-12">
        <div
          className="agrument__text"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: entry.content }}
        />
      </div>
    </section>
  </article>
);

SubmissionPreview.propTypes = {
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
};

export default SubmissionPreview;
