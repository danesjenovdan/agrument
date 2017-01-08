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
  </div>
);

export default Sidebar;
