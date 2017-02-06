import React from 'react';
import { autobind } from 'core-decorators';
import TriangleHeading from '../Card/TriangleHeading';
import AgrumentVotePreview from './AgrumentVotePreview';
import { getVotable } from '../../utils/dash';

class Votable extends React.Component {
  constructor() {
    super();

    this.state = {
      error: false,
      votable: null,
    };
  }

  componentDidMount() {
    this.dataRequest = getVotable().end(this.setVotableState);
  }

  componentWillUnmount() {
    if (this.dataRequest) {
      this.dataRequest.abort();
    }
  }

  @autobind
  setVotableState(err, res) {
    this.dataRequest = null;

    if (err || !res.body) {
      console.error(err);
      this.setState({ error: true });
    } else if (!res.body.votable || !res.body.votable.length) {
      console.error('No votables!');
    } else {
      this.setState({ votable: res.body.votable });
    }
  }

  render() {
    return (
      <div>
        <TriangleHeading title="Agrumenti, za katere lahko glasuješ" />
        {this.state.votable ? (
          this.state.votable.map(post => <AgrumentVotePreview key={post.id} data={post} />)
        ) : null}
      </div>
    );
  }
}

export default Votable;
