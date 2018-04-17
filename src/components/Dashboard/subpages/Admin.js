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
    store.emit('submissions:remove', id);
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
          <RenderSpinner isLoading={state.submissions.isLoading} hasData={state.submissions.data}>
            <TriangleHeading title="Agrumenti, ki čakajo na oddajo" />
            <div className="card__content clearfix">
              <table className="table table-hover table-agrument-list">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Datum</th>
                    <th>Avtor</th>
                    <th>Naslov</th>
                    <th>Uredi</th>
                  </tr>
                </thead>
                <tbody>
                  {state.submissions.data && state.submissions.data.map(e => (
                    <tr key={e.id}>
                      <td>{e.id}</td>
                      <td>{toSloDateString(e.date)}</td>
                      <td>{e.author_name}</td>
                      <td>{e.title}</td>
                      <td>
                        <Link to={`/dash/edit/${toSloDateString(e.date)}`} className="btn btn-primary btn-xs">
                          <i className="glyphicon glyphicon-edit" />
                        </Link>
                        <button className="btn btn-danger btn-xs" onClick={removeSubmission(e.id)} disabled={e.disabled}>
                          <i className="glyphicon glyphicon-remove" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </RenderSpinner>
        </div>
        <div className="col-md-12">
          <RenderSpinner isLoading={state.users.isLoading} hasData={state.users.data}>
            <TriangleHeading title="Dodaj nov agrument v čakalnico" />
            <div className="card__content clearfix">
              <AssignNewSubmission users={state.users.data} newArticle={state.newArticle} />
            </div>
          </RenderSpinner>
        </div>
        <hr />
        <div className="col-md-12">
          <RenderSpinner isLoading={state.users.isLoading} hasData={state.users.data}>
            <AddUser newUser={state.newUser} />
          </RenderSpinner>
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
