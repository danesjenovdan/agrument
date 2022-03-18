import React from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import slLocale from 'date-fns/locale/sl';
import 'react-datepicker/dist/react-datepicker.css';

registerLocale('sl', slLocale);

export default function LocaleDatePicker(props) {
  return <DatePicker {...props} locale="sl" dateFormat="d. M. yyyy" />;
}
