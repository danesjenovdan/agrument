import React from 'react';
import { listAllPending, removePending } from '../../utils/dash';
import { toSloDateString } from '../../utils/date';

class PendingList extends React.Component {
  constructor() {
    super();

    this.state = {
      pending: null,
    };
  }

  componentDidMount() {
    listAllPending().end((err, res) => {
      if (err || !res.ok) {
        console.log(err);
      } else {
        this.setState({ pending: res.body.pending });
      }
    });
  }

  deleteSubmission(id) {
    return function (event) {
      event.preventDefault();
      event.target.disabled = true;
      removePending(id).end((err, res) => {
        if (err || !res.ok) {
          console.log(err);
        } else {
          window.location.reload();
        }
      });
    };
  }

  render() {
    if (!this.state.pending) {
      return (
        <div>Nalaganje...</div>
      );
    }
    const pending = this.state.pending.map(entry => (
      <tr key={entry.id}>
        <td>{entry.id}</td>
        <td>{toSloDateString(entry.deadline)}</td>
        <td>{toSloDateString(entry.date)}</td>
        <td>{entry.author_name}</td>
        <td>{entry.title}</td>
        <td>{entry.type}</td>
        <td><button className="btn btn-danger" onClick={this.deleteSubmission(entry.id)}>X</button></td>
      </tr>
    ));
    return (
      <div>
        <h3>Agrumenti ki čakajo na oddajo:</h3>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>id</th>
              <th>deadline</th>
              <th>date</th>
              <th>avtor</th>
              <th>naslov</th>
              <th>type</th>
              <th>izbriši</th>
            </tr>
          </thead>
          <tbody>
            {pending}
          </tbody>
        </table>
      </div>
    );
  }
}

export default PendingList;
