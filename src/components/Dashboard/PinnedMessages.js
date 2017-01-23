import React from 'react';
import CardHeading from '../../components/Card/Heading';
import PinnedMessage from './PinnedMessage';
import { getPinned } from '../../utils/dash';

class PinnedMessages extends React.Component {
  constructor() {
    super();

    this.state = {
      loading: true,
      data: [],
      error: false,
    };
  }

  componentDidMount() {
    this.dataRequest = getPinned().end((err, res) => {
      this.setState({ loading: false });
      this.dataRequest = null;

      if (err) {
        console.error(err);
        this.setState({ error: true });
      } else if (!res.body.pinned || !res.body.pinned.length) {
        console.log('No pinned messages!');
      } else {
        this.setState({ data: res.body.pinned });
      }
    });
  }

  componentWillUnmount() {
    if (this.dataRequest) {
      this.dataRequest.abort();
    }
  }

  render() {
    let content;
    if (this.state.loading) {
      content = <div>Nalaganje...</div>;
    } else if (this.state.error) {
      content = <div>Napaka :(</div>;
    } else if (this.state.data.length) {
      content = this.state.data.map(p => <PinnedMessage key={p.id} data={p} />);
    } else {
      content = <div>Ni sporočil.</div>;
    }
    return (
      <div>
        <CardHeading title="Napovedane teme in čvek" />
        <div className="component__horizontal-scroll-container">
          {content}
        </div>
      </div>
    );
  }
}

export default PinnedMessages;
