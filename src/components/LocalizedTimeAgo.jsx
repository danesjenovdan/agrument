import React from 'react';
import PropTypes from 'prop-types';
import TimeAgo from 'react-timeago';
import sloStrings from 'react-timeago/lib/language-strings/sl';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';

const slFormatter = buildFormatter(sloStrings);

export default function LocalizedTimeAgo({ date }) {
  return <TimeAgo formatter={slFormatter} date={date} />;
}

LocalizedTimeAgo.propTypes = {
  date: PropTypes.number.isRequired,
};
