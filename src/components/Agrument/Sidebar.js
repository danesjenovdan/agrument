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
    <div
      className="agrument__license"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: `
          <p xmlns:dct="http://purl.org/dc/terms/">
            Izdano pod licenco <a rel="license" href="https://creativecommons.org/publicdomain/zero/1.0/deed.sl">CC0</a>.
            <small>Kolikor dopušča zakonodaja, se <a rel="dct:publisher" href="https://danesjenovdan.si/"><span property="dct:title">Danes je nov dan, Inštitut za druga vprašanja</span></a> odpoveduje vsem avtorskim in sorodnim pravicam glede <span property="dct:title">spletnega mesta danesjenovdan.si</span> z izjemo vseh ikon in slik objavljenih na <a href="https://agrument.danesjenovdan.si">Agrumentu</a>, ki jih nismo ustvarili na inštitutu.</small>
          </p>
        `,
      }}
    />
  </div>
);

export default Sidebar;
