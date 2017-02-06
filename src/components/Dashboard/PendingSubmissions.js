import React from 'react';
import { autobind } from 'core-decorators';
import TriangleHeading from '../Card/TriangleHeading';
import AgrumentEditor from './AgrumentEditor';
import { getPending } from '../../utils/dash';

class Pending extends React.Component {
  constructor() {
    super();

    this.state = {
      error: false,
      submissions: null,
    };
  }

  componentDidMount() {
    this.dataRequest = getPending().end(this.setSubmissionsState);
  }

  componentWillUnmount() {
    if (this.dataRequest) {
      this.dataRequest.abort();
    }
  }

  @autobind
  setSubmissionsState(err, res) {
    this.dataRequest = null;

    if (err || !res.body) {
      console.error(err);
      this.setState({ error: true });
    } else if (!res.body.submissions || !res.body.submissions.length) {
      console.error('No submissions!');
    } else {
      this.setState({ submissions: res.body.submissions });
    }
  }

  render() {
    return (
      <div>
        <TriangleHeading title="Agrumenti, ki jih moraš oddati" />
        {this.state.submissions ? (
          this.state.submissions.map(post => <AgrumentEditor key={post.id} data={post} />)
        ) : null}
      </div>
    );
  }
}

export default Pending;
