import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import RenderSpinner from '../../../hoc/RenderSpinner';
import TriangleHeading from '../../Card/TriangleHeading';
import AssignNewSubmission from '../AssignNewSubmission';
import { toSloDateString } from '../../../utils/date';
import AddUser from '../AddUser';

import store from '../../../store';

function removeSubmission(id) {
  return () => {
    // eslint-disable-next-line no-alert
    if (window.confirm('Si prepričan/-a, da želiš izbrisati ta agrument? Tega se ne da razveljaviti!')) {
      store.emit('submissions:remove', id);
    }
  };
}

class Admin extends React.Component {
  componentDidMount() {
    store.emit('users:fetch');
    store.emit('submissions:fetch');
  }

  render() {
    const { state } = this.props;
    if (state.user.data.group !== 'admin') {
      return null;
    }

    return (
      <div className="row">
        <div className="col-md-12">
          <TriangleHeading title="Agrumenti, ki čakajo na oddajo" />
          <div className="card__content clearfix">
            <RenderSpinner isLoading={state.submissions.isLoading} data={state.submissions.data}>
              {data => (
                <table className="table table-hover table-agrument-list">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Datum</th>
                      <th>Avtor</th>
                      <th>Naslov</th>
                      <th className="text-right">Uredi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map(e => (
                      <tr key={e.id}>
                        <td>{e.id}</td>
                        <td>{toSloDateString(e.date)}</td>
                        <td>{e.author_name}</td>
                        <td>{e.title}</td>
                        <td className="text-right">
                          <Link to={`/dash/edit/${toSloDateString(e.date)}`} className="btn btn-primary btn-xs">
                            <i className="glyphicon glyphicon-edit" />
                          </Link>
                          <button type="button" className="btn btn-danger btn-xs" onClick={removeSubmission(e.id)} disabled={e.disabled}>
                            <i className="glyphicon glyphicon-remove" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </RenderSpinner>
          </div>
        </div>
        <div className="col-md-6">
          <TriangleHeading title="Dodaj nov agrument v čakalnico" />
          <div className="card__content clearfix">
            <RenderSpinner isLoading={state.users.isLoading} data={state.users.data}>
              {data => (
                <AssignNewSubmission users={data} newArticle={state.newArticle} />
              )}
            </RenderSpinner>
          </div>
        </div>
        <hr />
        <div className="col-md-6">
          <TriangleHeading title="Dodaj novega uporabnika" />
          <div className="card__content clearfix">
            <RenderSpinner isLoading={state.users.isLoading} data={state.users.data}>
              {() => (
                <AddUser state={state} />
              )}
            </RenderSpinner>
          </div>
        </div>
      </div>
    );
  }
}

Admin.propTypes = {
  state: PropTypes.shape().isRequired,
};

export default Admin;

// import { addBulkSubmission } from '../../utils/dash';
/*
{/*
          THIS IS A COMMENT
          <hr />
          <textarea ref={(e) => { this.bulkarea = e; }} />
          <button onClick={bulkUp.bind(this)}>bulk upload</button>
        }
 */
// function chunk(arr, len) {
//   const chunks = [];
//   const n = arr.length;
//   let i = 0;
//   while (i < n) {
//     chunks.push(arr.slice(i, i += len));
//   }
//   return chunks;
// }

// // Execute a list of Promise return functions in series
// function pseries(list) {
//   const p = Promise.resolve();
//   return list.reduce((pacc, fn) => pacc.then(fn), p);
// }

// function bulkUp() {
//   const data = JSON.parse(this.bulkarea.value);
//   const c = chunk(data, 25);

//   const fnlist = c.map(e => addBulkSubmission.bind(null, e));
//   pseries(fnlist).then(() => {
//     console.log('done!');
//   });
// }
