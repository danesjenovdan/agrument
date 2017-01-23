import React from 'react';
import { autobind } from 'core-decorators';
import TriangleHeading from '../Card/TriangleHeading';
import AgrumentEditor from './AgrumentEditor';
import AgrumentVotePreview from './AgrumentVotePreview';
import Navbar from './Navbar';
import { getPending, getVotable } from '../../utils/dash';
import PinnedMessages from './PinnedMessages';

class Container extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
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
    this.setState({ loading: false });
    this.dataRequest = null;

    if (err) {
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
      <div className="container dash__container">
        <Navbar />
        <PinnedMessages />
        <div className="row">
          <div className="col-lg-6">
            <div className="clearfix" />
            <TriangleHeading title="Agrumenti, ki jih moraš oddati" />
            {this.state.submissions ? (
              this.state.submissions.map(post => <AgrumentEditor key={post.id} data={post} />)
            ) : null}
          </div>
          <div className="col-lg-6">
            <div className="clearfix" />
            <TriangleHeading title="Agrumenti, za katere lahko glasuješ" />
            {this.state.submissions ? (
              this.state.submissions.map(post => <AgrumentVotePreview key={post.id} data={post} />)
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

export default Container;
