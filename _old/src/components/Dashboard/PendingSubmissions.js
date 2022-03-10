import React from 'react';
import PropTypes from 'prop-types';
import TriangleHeading from '../Card/TriangleHeading';
import PendingEntry from './PendingEntry';
import RenderSpinner from '../../hoc/RenderSpinner';

import store from '../../store';

class PendingSubmissions extends React.PureComponent {
  componentDidMount() {
    store.emit('pending:fetch');
  }

  render() {
    const { state } = this.props;
    return (
      <RenderSpinner isLoading={state.pending.isLoading} data={state.pending.data}>
        {(data) => (
          <div>
            <TriangleHeading title="Agrumenti, ki jih moraš oddati" />
            {data.map((entry) => <PendingEntry key={entry.id} entry={entry} />)}
          </div>
        )}
      </RenderSpinner>
    );
  }
}

PendingSubmissions.propTypes = {
  state: PropTypes.shape().isRequired,
};

export default PendingSubmissions;
