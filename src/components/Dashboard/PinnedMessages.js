import React from 'react';
import { autobind } from 'core-decorators';
import CardHeading from '../../components/Card/Heading';
import PinnedMessage from './PinnedMessage';
import { getPinned } from '../../utils/dash';
import PinnedMessageAdd from './PinnedMessageAdd';

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
    this.dataRequest = getPinned().end(this.updatePinnedMessages);
  }

  componentWillUnmount() {
    if (this.dataRequest) {
      this.dataRequest.abort();
    }
  }

  @autobind
  onChanged() {
    this.dataRequest = getPinned().end(this.updatePinnedMessages);
  }

  @autobind
  updatePinnedMessages(err, res) {
    this.setState({ loading: false });
    this.dataRequest = null;

    if (err) {
      console.error(err);
      this.setState({ error: true });
    } else if (res.body && res.body.pinned && res.body.pinned.length) {
      this.setState({ data: res.body.pinned });
    }
  }

  render() {
    let content;
    if (this.state.loading) {
      content = <div>Nalaganje...</div>;
    } else if (this.state.error) {
      content = <div>Napaka :(</div>;
    } else if (this.state.data.length) {
      content = this.state.data
        .map(p => <PinnedMessage key={p.id} data={p} onChanged={this.onChanged} />);
    } else {
      content = <div>Ni sporočil.</div>;
    }
    return (
      <div>
        <CardHeading title="Napovedane teme in čvek" />
        <div className="component__horizontal-scroll-container">
          <PinnedMessageAdd onChanged={this.onChanged} />
          {content}
        </div>
      </div>
    );
  }
}

export default PinnedMessages;
