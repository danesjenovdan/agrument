import React, { PropTypes } from 'react';
import TimeAgo from 'react-timeago';
import sloStrings from 'react-timeago/lib/language-strings/sl';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';

const slFormatter = buildFormatter(sloStrings);

const LocalizedTimeAgo = ({ date }) => (
  <TimeAgo formatter={slFormatter} date={date} />
);

LocalizedTimeAgo.propTypes = {
  date: PropTypes.number.isRequired,
};

export default LocalizedTimeAgo;
