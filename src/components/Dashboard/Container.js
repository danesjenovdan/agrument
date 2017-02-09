import React from 'react';
import { browserHistory } from 'react-router';
import Navbar from './Navbar';
import { getUser } from '../../utils/dash';
import PinnedMessages from './PinnedMessages';
import PendingSubmissions from './PendingSubmissions';
import VotableSubmissions from './VotableSubmissions';
import Spinner from '../Spinner';
import AssignNewAgrument from './AssignNewAgrument';
import PendingList from './PendingList';

class Container extends React.Component {
  constructor() {
    super();

    this.state = {
      user: null,
    };
  }

  componentDidMount() {
    getUser().end((err, res) => {
      if (err || !res.ok) {
        browserHistory.replace('/login');
      } else {
        this.setState({ user: res.body });
      }
    });
  }

  render() {
    if (!this.state.user) {
      return (
        <div className="container dash__container">
          <Spinner />
        </div>
      );
    }
    return (
      <div className="container dash__container">
        <Navbar username={this.state.user.name} />
        <PinnedMessages />
        {this.state.user.group === 'admin' ? (
          <div>
            <AssignNewAgrument />
            <PendingList />
          </div>
        ) : null}
        <div className="row">
          <div className="col-lg-6">
            <PendingSubmissions />
          </div>
          <div className="col-lg-6">
            <VotableSubmissions />
          </div>
        </div>
      </div>
    );
  }
}

export default Container;
