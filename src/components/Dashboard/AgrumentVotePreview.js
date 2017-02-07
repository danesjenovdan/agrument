import React, { PropTypes } from 'react';
import Button from '../FormControl/Button';

const AgrumentVotePreview = ({ data }) => (
  <article className="component__agrument-preview">
    {data.hasEmbed ? (
      <div className="embed-responsive" style={{ paddingBottom: data.embedHeight || '56.25%' }} dangerouslySetInnerHTML={{ __html: data.embedCode }} />
    ) : null}
    <div className="text-center">
      <img src={data.imageURL} className="img-responsive img-thumbnail" alt="og" />
    </div>
    <p className="lead">{data.title}</p>
    <div className="agrument__text" dangerouslySetInnerHTML={{ __html: data.content }} />
    <div>
      <Button value="Za" disabled />
      <Button value="Proti" disabled />
      <Button value="Veto" disabled />
    </div>
  </article>
);

AgrumentVotePreview.propTypes = {
  data: PropTypes.shape().isRequired,
};

export default AgrumentVotePreview;
