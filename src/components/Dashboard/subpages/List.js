import React from 'react';
import PropTypes from 'prop-types';

import store from '../../../store';

class List extends React.Component {
  componentDidMount() {
    store.trigger('published:fetch');
  }

  render() {
    const { state } = this.props;

    let content = null;
    if (state.published.data) {
      content = state.published.data.map(e => e.title);
    }
    // TODO: spinner and proper table display

    return (
      <div className="row">
        <div className="col-md-8 col-md-offset-2">
          {content}
        </div>
      </div>
    );
  }
}

List.propTypes = {
  state: PropTypes.shape().isRequired,
};

export default List;
