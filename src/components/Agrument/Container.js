import React from 'react';
import { Link } from 'react-router-dom';
import { StickyContainer, Sticky } from 'react-sticky';
import Feed from './Feed';
import Sidebar from './Sidebar';

const Container = () => (
  <div className="container agrument__container">
    <Link to="/dash">Dash</Link>
    <StickyContainer>
      { /* TODO: remove this link */ }
      <div className="row">
        <div className="col-md-9">
          <Feed />
        </div>
        <div className="col-md-3 hidden-xs hidden-sm">
          <Sticky>{
            ({ style }) => (
              <div style={style}>
                <Sidebar />
              </div>
            )
          }</Sticky>
        </div>
      </div>
    </StickyContainer>
  </div>
);

export default Container;
