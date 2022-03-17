import React from 'react';
import { useLocation } from 'react-router-dom';

export default function Agrument() {
  const location = useLocation();

  const redirectUrl = `https://danesjenovdan.si/agrument${location.pathname}`;

  return <div>TODO: redirect to {redirectUrl}</div>;
}
