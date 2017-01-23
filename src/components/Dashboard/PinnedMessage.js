import React, { PropTypes } from 'react';

const Message = ({ data }) => (
  <div className="pinned__wrapper" id={data.id}>
    <div className="pinned__content">
      <small>{data.timestamp}</small>
      <h4>Avtor: {data.author}</h4>
      <p>{data.message}</p>
    </div>
  </div>
);

Message.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.number.isRequired,
    author: PropTypes.number.isRequired,
    timestamp: PropTypes.number.isRequired,
    message: PropTypes.string.isRequired,
  }).isRequired,
};

export default Message;
