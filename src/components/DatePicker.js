/**
 * This component wraps react-date-picker and does nothing when required on server-side to prevent
 * crashing by accesing the 'window' property.
 */

let DatePicker = null; // eslint-disable-line import/no-mutable-exports
if (process.env.BROWSER) {
  DatePicker = require('react-date-picker').default; // eslint-disable-line global-require
}

export default DatePicker;
