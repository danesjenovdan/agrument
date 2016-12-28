import React, { PropTypes } from 'react';
import Waypoint from 'react-waypoint';
import { concat } from 'lodash';
import { browserHistory } from 'react-router';
import { autobind } from 'core-decorators';
import Article from './Article';
import WaypointBlock from '../WaypointBlock';
import Spinner from '../Spinner';
import Button from '../FormControl/Button';
import { formatDateForURL, getPostByID, getInitialPost } from '../../actions/agrument';

let dontChangeURLOnScroll = false;

function changeURLOnScroll(event, post) {
  if (dontChangeURLOnScroll) {
    return;
  }
  const newPath = `/${formatDateForURL(post.date)}`;
  if (window.location.pathname !== newPath) {
    browserHistory.push({ pathname: newPath, state: { postId: +post.id } });
  }
}

class Feed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      error: false,
      data: null,
      shouldLoadAbove: !!this.props.params.date,
      shouldLoadBelow: true,
    };
  }

  componentDidMount() {
    this.dataRequest = getInitialPost(this.props.params.date).end(this.setInitialArticleState);

    this.cancelListen = browserHistory.listen((event) => {
      if (event.state && event.state.postId && event.action === 'POP') {
        const elem = document.querySelector(`#post-${event.state.postId}`);
        if (elem) {
          dontChangeURLOnScroll = true;
          setTimeout(() => {
            elem.scrollIntoView(true);
            dontChangeURLOnScroll = false;
          }, 0);
        }
      }
    });
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.data && this.state.data.length !== nextState.data.length) {
      if (this.state.data[0].id !== nextState.data[0].id) {
        this.oldHeight = document.body.scrollHeight;
      }
    }
  }

  componentDidUpdate() {
    if (this.oldHeight) {
      const newHeight = document.body.scrollHeight;
      const diff = newHeight - this.oldHeight;
      document.body.scrollTop += diff;
      this.oldHeight = null;
    }
  }

  componentWillUnmount() {
    if (this.dataRequest) {
      this.dataRequest.abort();
    }
    if (this.cancelListen) {
      this.cancelListen();
    }
  }

  @autobind
  setInitialArticleState(err, res) {
    this.setState({ loading: false });
    this.dataRequest = null;

    if (err) {
      console.error(err);
      this.setState({ error: true });
    } else if (!res.body.agrument_posts || !res.body.agrument_posts.length) {
      console.error('Initial post not found!');
      this.setState({ error: true });
    } else {
      this.setState({ data: res.body.agrument_posts });
    }
  }

  updateArticleState(err, res, prepend) {
    this.setState({ loading: false });
    this.dataRequest = null;

    if ((err && err.status === 404) || (!err && (!res.body.agrument_posts || !res.body.agrument_posts.length))) {
      if (prepend) {
        this.setState({ shouldLoadAbove: false });
      } else {
        this.setState({ shouldLoadBelow: false });
      }
    } else if (err) {
      console.error(err);
      this.setState({ error: true });
    } else {
      let mergedData;
      if (prepend) {
        mergedData = concat(res.body.agrument_posts, this.state.data);
      } else {
        mergedData = concat(this.state.data, res.body.agrument_posts);
      }
      this.setState({ data: mergedData });
    }
  }

  lazyLoadBelow() {
    if (!this.state.loading && this.state.shouldLoadBelow) {
      this.setState({ loading: true });
      const lastId = this.state.data[this.state.data.length - 1].id;
      this.dataRequest = getPostByID(lastId - 1).end((err, res) => this.updateArticleState(err, res, false));
    }
  }

  lazyLoadAbove() {
    if (!this.state.loading && this.state.shouldLoadAbove && !this.oldHeight) {
      this.setState({ loading: true });
      const firstId = this.state.data[0].id;
      this.dataRequest = getPostByID(firstId + 1).end((err, res) => this.updateArticleState(err, res, true));
    }
  }

  render() {
    const content = [];
    if (this.state.data) {
      if (this.state.shouldLoadAbove) {
        content.push(<div key="load-above" className="agrument__spinner-container">
          {this.state.loading ? <Spinner /> : <Button key="load-above" onClickFunc={() => this.lazyLoadAbove()} value="^ Naloži ^" />}
        </div>);
      }

      const articles = this.state.data.map((post, i) => (
        <WaypointBlock key={i} onEnterFunc={event => changeURLOnScroll(event, post)}>
          <Article data={post} />
        </WaypointBlock>
      ));
      content.push(...articles);

      if (this.state.shouldLoadBelow) {
        content.push(<div key="load-below" className="agrument__spinner-container">
          {this.state.loading ? <Spinner /> : <Waypoint onEnter={() => this.lazyLoadBelow()} bottomOffset={-100} />}
        </div>);
      }
    } else if (this.state.loading) {
      content.push(<div key="load-main" className="agrument__spinner-container">
        <Spinner />
      </div>);
    } else {
      content.push(<div key="load-main" className="agrument__spinner-container">
        <h1>NAPAKA :(</h1>
      </div>);
    }
    return (
      <div className="agrument__feed">
        {content}
      </div>
    );
  }
}

Feed.propTypes = {
  params: PropTypes.shape({ date: PropTypes.string }),
};

export default Feed;
