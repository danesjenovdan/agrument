import React from 'react';
import PropTypes from 'prop-types';
import CardHeading from '../../components/Card/Heading';
import PinnedMessage, { PinnedNotice } from './PinnedMessage';
import PinnedMessageAdd from './PinnedMessageAdd';

import store from '../../store';

class PinnedMessages extends React.PureComponent {
  componentDidMount() {
    store.emit('pinned:fetch');
  }

  render() {
    const { pinned, user } = this.props;

    let content = null;
    if (pinned.isLoading && !pinned.data) {
      content = (
        <div className="component__horizontal-scroll-container">
          <PinnedNotice title="Nalaganje ..." />
        </div>
      );
    } else if (pinned.data) {
      content = (
        <div className="component__horizontal-scroll-container">
          <PinnedMessageAdd newMessage={pinned.newMessage} />
          {pinned.data.length
            ? pinned.data.map(message => (
              <PinnedMessage key={message.id} message={message} user={user} />
            ))
            : <PinnedNotice title="Ni sporočil."><p>Napiši nekaj novega :)</p></PinnedNotice>
          }
        </div>
      );
    }
    return (
      <div>
        <CardHeading title="Napovedane teme in čvek" />
        {content}
      </div>
    );
  }
}

PinnedMessages.propTypes = {
  pinned: PropTypes.shape().isRequired,
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    group: PropTypes.string.isRequired,
  }).isRequired,
};

export default PinnedMessages;
