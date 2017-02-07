import React from 'react';
import { autobind } from 'core-decorators';
import TriangleHeading from '../Card/TriangleHeading';
import PendingEntry from './PendingEntry';
import { getPending } from '../../utils/dash';

class Pending extends React.Component {
  constructor() {
    super();

    this.state = {
      error: false,
      pending: null,
    };
  }

  componentDidMount() {
    this.dataRequest = getPending().end(this.setPendingState);
  }

  componentWillUnmount() {
    if (this.dataRequest) {
      this.dataRequest.abort();
    }
  }

  @autobind
  setPendingState(err, res) {
    this.dataRequest = null;

    if (err || !res.body) {
      console.error(err);
      this.setState({ error: true });
    } else if (!res.body.pending || !res.body.pending.length) {
      console.error('No pending!');
    } else {
      this.setState({ pending: res.body.pending });
    }
  }

  render() {
    return (
      <div>
        <TriangleHeading title="Agrumenti, ki jih moraš oddati" />
        {this.state.pending ? (
          this.state.pending.map(post => <PendingEntry key={post.id} data={post} />)
        ) : null}
      </div>
    );
  }
}

export default Pending;
