import React from 'react';
import { StickyContainer, Sticky } from 'react-sticky';
import Feed from './Feed';
import Sidebar from './Sidebar';

const Container = () => (
  <div className="container agrument__container">
    <StickyContainer>
      <div className="row">
        <div className="col-md-9">
          <Feed />
        </div>
        <div className="col-md-3 hidden-xs hidden-sm">
          <Sticky>
            {({ style }) => (
              <div style={style}>
                <Sidebar />
              </div>
            )}
          </Sticky>
        </div>
      </div>
    </StickyContainer>
  </div>
);

export default Container;
