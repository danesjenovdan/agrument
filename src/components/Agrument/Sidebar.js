import React from 'react';
import Card from '../Card';
import SubscribeForm from './SubscribeForm';

const Sidebar = () => (
  <div className="agrument__sidebar">
    <div className="clearfix" />
    <Card title="Naroči se na objave!">
      <SubscribeForm />
    </Card>
  </div>
);

export default Sidebar;
