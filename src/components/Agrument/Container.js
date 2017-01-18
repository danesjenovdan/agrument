import React, { PropTypes } from 'react';
import { Link } from 'react-router/es6';
import { StickyContainer, Sticky } from 'react-sticky';
import Feed from './Feed';
import Sidebar from './Sidebar';

const Container = ({ params }) => (
  <div className="container agrument__container">
    <StickyContainer>
      <Link to="/dash">Dash</Link> { /* TODO: remove this link */ }
      <div className="row">
        <div className="col-md-9">
          <Feed params={params} />
        </div>
        <div className="col-md-3 hidden-xs hidden-sm">
          <Sticky>
            <Sidebar />
          </Sticky>
        </div>
      </div>
    </StickyContainer>
  </div>
);

Container.propTypes = {
  params: PropTypes.shape({ date: PropTypes.string }),
};

export default Container;
