import React from 'react';
import { autobind } from 'core-decorators';
import { getAllUsers, addPending } from '../../utils/dash';

class AssignNewAgrument extends React.Component {
  constructor() {
    super();

    this.state = {
      users: null,
      selectedUser: null,
      creating: false,
    };
  }

  componentDidMount() {
    getAllUsers().end((err, res) => {
      if (err || !res.ok) {
        console.log(err);
      } else {
        this.setState({ users: res.body.users });
        if (res.body.users.length) {
          this.setState({ selectedUser: res.body.users[0].id });
        }
      }
    });
  }

  @autobind
  onUserChange(event) {
    console.log(+event.target.value);
    this.setState({ selectedUser: +event.target.value });
  }

  @autobind
  createNew(event) {
    event.preventDefault();
    this.setState({ creating: true });
    addPending(this.state.selectedUser).end((err, res) => {
      this.setState({ creating: false });
      if (err || !res.ok) {
        console.log(err);
      } else {
      }
    });
  }

  render() {
    if (!this.state.users) {
      return (
        <div>Nalaganje...</div>
      );
    }
    const users = this.state.users.map(user => (
      <option key={user.id} value={user.id}>{user.name} ({user.group})</option>
    ));
    return (
      <div className="form-inline">
        Ustvari nov agrument za:
        <select className="form-control" onChange={this.onUserChange} disabled={this.state.creating}>
          {users}
        </select>
        <button className="btn btn-default" disabled={this.state.creating} onClick={this.createNew}>Ustvari</button>
      </div>
    );
  }
}

export default AssignNewAgrument;
