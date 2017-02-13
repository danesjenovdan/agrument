import React, { PropTypes } from 'react';
import TriangleHeading from '../Card/TriangleHeading';
import PendingEntry from './PendingEntry';

import store from '../../store';

class PendingSubmissions extends React.PureComponent {
  componentDidMount() {
    store.trigger('pending:fetch');
  }

  render() {
    const { pending, currentEditor } = this.props;

    let content = null;
    if (pending.isLoading && !pending.data) {
      content = <div>Nalaganje ...</div>;
    } else if (pending.data) {
      content = pending.data.map(entry => (
        <PendingEntry key={entry.id} entry={entry} currentEditor={currentEditor} />
      ));
    }
    return (
      <div>
        <TriangleHeading title="Agrumenti, ki jih moraš oddati" />
        {content}
      </div>
    );
  }
}

PendingSubmissions.propTypes = {
  pending: PropTypes.shape({
    isLoading: PropTypes.bool.isRequired,
    data: PropTypes.arrayOf(PropTypes.shape()),
  }).isRequired,
  currentEditor: PropTypes.shape(),
};

PendingSubmissions.defaultProps = {
  currentEditor: null,
};

export default PendingSubmissions;
