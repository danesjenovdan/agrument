import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import Card from '../Card';
import AgrumentEditor from './AgrumentEditor';

const Container = () => (
  <div className="container dash__container">
    <Link to="/">Home</Link> { /* TODO: remove this link */}
    <div className="row">
      <div className="col-md-6">
        <div className="clearfix" />
        <Card title="Agrumenti, ki jih moraš oddati" />
        <AgrumentEditor />
        <AgrumentEditor />
      </div>
      <div className="col-md-6">
        <div className="clearfix" />
        <Card title="Agrumenti, za katere lahko glasuješ" />
      </div>
    </div>
  </div>
);

Container.propTypes = {
  params: PropTypes.shape({ date: PropTypes.string }),
};

export default Container;
