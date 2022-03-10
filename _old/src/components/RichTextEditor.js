/**
 * This component wraps react-rte and does nothing when required on server-side to prevent crashing
 * by accesing the 'window' property.
 */

let RichTextEditor = null; // eslint-disable-line import/no-mutable-exports
if (process.env.BROWSER) {
  RichTextEditor = require('react-rte').default; // eslint-disable-line global-require
}

export default RichTextEditor;
