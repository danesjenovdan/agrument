import { withRouter } from 'react-router-dom';

const Agrument = ({ location, staticContext }) => {
  const redirectUrl = `https://danesjenovdan.si/agrument${location.pathname}`;
  if (staticContext) {
    // eslint-disable-next-line no-param-reassign
    staticContext.url = redirectUrl;
  } else if (typeof window !== 'undefined') {
    window.location = redirectUrl;
  }
  return null;
};

export default withRouter(Agrument);
