import React from 'react';
import request from 'superagent';
import Waypoint from 'react-waypoint';
import { concat } from 'lodash';
import { autobind } from 'core-decorators';
import { browserHistory } from 'react-router';
import Article from './Article';
import WaypointBlock from '../WaypointBlock';
import { formatDateForURL } from '../../actions/agrument';

let dontChangeURLOnScroll = false;

class Feed extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      error: false,
      data: null,
    };
  }

  componentDidMount() {
    this.dataRequest = request
      .get('/data/agrument.json') // TODO: get the date from url here
      .end((err, res) => {
        if (err) {
          console.error(err);
          this.setState({ error: err, loading: false });
        } else {
          this.setState({ data: JSON.parse(res.text).agrument_posts, loading: false });
          this.dataRequest = null;
        }
      });

    this.cancelListen = browserHistory.listen((event) => {
      if (event.state && event.state.postId && event.action === 'POP') {
        dontChangeURLOnScroll = true;
        const elem = document.querySelector(`#post-${event.state.postId}`);
        if (elem) {
          setTimeout(() => {
            elem.scrollIntoView(true);
            dontChangeURLOnScroll = false;
          }, 0);
        }
      }
    });
  }

  componentWillUnmount() {
    if (this.dataRequest) {
      this.dataRequest.abort();
    }
    if (this.browserHistoryCallback) {
      this.cancelListen();
    }
  }

  lazyLoadMore() {
    if (!this.state.data || this.dataRequest) {
      return;
    }

    const lastId = +this.state.data[this.state.data.length - 1].id;
    if (lastId === this.lastFetchedId) {
      return;
    }

    // TODO: fix this up
    this.lastFetchedId = +lastId;
    this.dataRequest = request
      .get(`/data/agrument.json?id=${lastId + 1}`)
      .end((err, res) => {
        if (err) {
          console.error(err);
          // this.setState({ error: err, loading: false });
        } else {
          const json = JSON.parse(res.text);
          const mergedData = concat(this.state.data, json.agrument_posts);
          this.setState({ data: mergedData, loading: false });
        }
      });
  }

  @autobind
  changeScrollURL(event, post) {
    if (dontChangeURLOnScroll) {
      return;
    }
    const newPath = `/${formatDateForURL(post.date)}`;
    if (window.location.pathname !== newPath) {
      browserHistory.push({ pathname: newPath, state: { postId: +post.id } });
    }
  }

  render() {
    let content = null;
    if (this.state.loading) {
      content = <div>TODO: Spinner!</div>;
    } else if (this.state.error) {
      content = <div>{this.state.error.toString()}</div>;
    } else {
      content = this.state.data.map((post, i) => (
        <WaypointBlock key={i} onEnterFunc={event => this.changeScrollURL(event, post)}>
          <Article data={post} />
        </WaypointBlock>
      ));
    }
    return (
      <div className="agrument__feed">
        {content}
        <Waypoint onEnter={() => this.lazyLoadMore()} bottomOffset={-500} />
        <div>TODO: Spinner!</div>
      </div>
    );
  }
}

export default Feed;
