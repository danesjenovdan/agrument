import React from 'react';
import PropTypes from 'prop-types';
import TriangleHeading from '../Card/TriangleHeading';
import VotableEntry from './VotableEntry';
import RenderSpinner from '../../hoc/RenderSpinner';

import store from '../../store';

class VotableSubmissions extends React.PureComponent {
  componentDidMount() {
    store.emit('votable:fetch');
  }

  render() {
    const { state } = this.props;
    return (
      <RenderSpinner isLoading={state.votable.isLoading} data={state.votable.data}>
        {data => (
          <div>
            <TriangleHeading title="Agrumenti, za katere lahko glasuješ" />
            {data.map(entry => (
              <VotableEntry key={entry.id} entry={entry} state={state} />
            ))}
          </div>
        )}
      </RenderSpinner>
    );
  }
}

VotableSubmissions.propTypes = {
  state: PropTypes.shape().isRequired,
};

export default VotableSubmissions;
