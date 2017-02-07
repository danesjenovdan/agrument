import React, { PropTypes } from 'react';
import Button from '../FormControl/Button';

const AgrumentVotePreview = ({ data }) => (
  <article className="component__agrument-preview">
    {data.hasEmbed ? (
      <div className="embed-responsive" style={{ paddingBottom: '58%' }} dangerouslySetInnerHTML={{ __html: data.embedCode }} />
    ) : null}
    <div className="text-center">
      <img src={data.image} className="img-responsive img-thumbnail" alt="og" />
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
