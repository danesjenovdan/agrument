import React from 'react';
import TriangleHeading from '../Card/TriangleHeading';
import CardContent from '../Card/Content';
import SubscribeForm from './SubscribeForm';

const Sidebar = () => (
  <div className="agrument__sidebar">
    <div className="clearfix" />
    <TriangleHeading title="Naroči se na objave!" />
    <CardContent>
      <SubscribeForm />
    </CardContent>
    <div className="agrument__license">
      Izdano pod licenco <a href="https://creativecommons.org/publicdomain/zero/1.0/deed.sl" target="_blank" rel="noopener noreferrer">CC0</a>.
    </div>
  </div>
);

export default Sidebar;
