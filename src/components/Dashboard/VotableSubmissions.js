import React, { PropTypes } from 'react';
import TriangleHeading from '../Card/TriangleHeading';
import VotableEntry from './VotableEntry';

import store from '../../store';

class VotableSubmissions extends React.PureComponent {
  componentDidMount() {
    store.trigger('votable:fetch');
  }

  render() {
    const { votable, currentEditor, user } = this.props;

    let content = null;
    if (votable.isLoading && !votable.data) {
      content = <div>Nalaganje ...</div>;
    } else if (votable.data) {
      content = votable.data.map(entry => (
        <VotableEntry key={entry.id} entry={entry} currentEditor={currentEditor} user={user} />
      ));
    }
    return (
      <div>
        <TriangleHeading title="Agrumenti, za katere lahko glasuješ" />
        {content}
      </div>
    );
  }
}

VotableSubmissions.propTypes = {
  votable: PropTypes.shape({
    isLoading: PropTypes.bool.isRequired,
    data: PropTypes.arrayOf(PropTypes.shape()),
  }).isRequired,
  currentEditor: PropTypes.shape(),
  user: PropTypes.shape().isRequired,
};

VotableSubmissions.defaultProps = {
  currentEditor: null,
};

export default VotableSubmissions;
