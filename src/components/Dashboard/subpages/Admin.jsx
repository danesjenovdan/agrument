import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../../../store/slices/users.js';
import { fetchSubmissionsPosts } from '../../../store/slices/posts.js';
import { removeSubmission } from '../../../utils/requests/dash.js';
import { toSloDateString } from '../../../utils/date.js';
import RenderSpinner from '../../RenderSpinner.jsx';
import TriangleHeading from '../../Card/TriangleHeading.jsx';
import AssignNewSubmission from '../AssignNewSubmission.jsx';
// import AddUser from '../AddUser';

export default function Admin() {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.data);
  const users = useSelector((state) => state.users);
  const submissions = useSelector((state) => state.posts.submissions);

  const [isRemovingSubmission, setRemovingSubmission] = useState(false);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchSubmissionsPosts());
  }, [dispatch]);

  const onRemoveSubmission = async (event) => {
    event.preventDefault();
    if (
      // eslint-disable-next-line no-alert
      !window.confirm(
        'Si prepričan_a, da želiš izbrisati ta agrument? Tega se ne da razveljaviti!'
      )
    ) {
      return;
    }

    setRemovingSubmission(true);

    try {
      const id = Number(event.currentTarget.dataset.submissionId);
      await removeSubmission(id);
      await dispatch(fetchSubmissionsPosts());
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Removing submission failed!', err);
    }

    setRemovingSubmission(false);
  };

  if (user.group !== 'admin') {
    return <div>TODO: redirect to /dash</div>;
  }

  return (
    <div className="row">
      <div className="col-md-12">
        <TriangleHeading title="Agrumenti, ki čakajo na oddajo" />
        <div className="card__content clearfix">
          <RenderSpinner
            isLoading={submissions.loading}
            data={submissions.data}
          >
            {(data) => (
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
                  {data.map((e) => (
                    <tr key={e.id}>
                      <td>{e.id}</td>
                      <td>{toSloDateString(e.date, true)}</td>
                      <td>{e.author_name}</td>
                      <td>{e.title}</td>
                      <td className="text-right">
                        <Link
                          to={`/dash/edit/${toSloDateString(e.date)}`}
                          className="btn btn-primary btn-xs"
                        >
                          <i className="glyphicon glyphicon-edit" />
                        </Link>
                        <button
                          data-submission-id={e.id}
                          type="button"
                          className="btn btn-danger btn-xs"
                          onClick={onRemoveSubmission}
                          disabled={isRemovingSubmission}
                        >
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
          <RenderSpinner isLoading={users.loading} data={users.data}>
            {(data) => <AssignNewSubmission users={data} />}
          </RenderSpinner>
        </div>
      </div>
      <hr />
      <div className="col-md-6">
        <TriangleHeading title="Dodaj novega uporabnika" />
        <div className="card__content clearfix">
          {/* <RenderSpinner
            isLoading={state.users.isLoading}
            data={state.users.data}
          >
            {() => <AddUser state={state} />}
          </RenderSpinner> */}
        </div>
      </div>
    </div>
  );
}
