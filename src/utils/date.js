import _ from 'lodash';

function parseDateString(input) {
  const str = String(input);
  let dateObj = null;
  if (str.indexOf('.') !== -1) {
    const parts = str.split('.');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);
      if (day && month && year) {
        dateObj = new Date(Date.UTC(year, month - 1, day));
      }
    }
  } else if (str.indexOf('-') !== -1) {
    const parts = str.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const day = parseInt(parts[2], 10);
      if (day && month && year) {
        dateObj = new Date(Date.UTC(year, month - 1, day));
      }
    }
  }
  if (!dateObj) {
    dateObj = new Date();
    dateObj.setUTCHours(0, 0, 0, 0);
  }
  return dateObj;
}

function toISODateString(date) {
  const dateObj = _.isDate(date) ? date : parseDateString(date);
  return dateObj.toISOString().split('T')[0];
}

function toSloDateString(date, spaces = false) {
  const dateObj = _.isDate(date) ? date : parseDateString(date);
  const spaceChar = spaces ? ' ' : '';
  return `${dateObj.getUTCDate()}.${spaceChar}${dateObj.getUTCMonth() + 1}.${spaceChar}${dateObj.getUTCFullYear()}`;
}

export {
  toISODateString,
  toSloDateString,
};
