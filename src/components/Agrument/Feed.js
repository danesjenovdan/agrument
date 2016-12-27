import React from 'react';
import request from 'superagent';
import Waypoint from 'react-waypoint';
import { Link } from 'react-router';
import { concat } from 'lodash';
import Article from './Article';
import WaypointBlock from '../WaypointBlock';

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
      .get('/data/agrument.json')
      .end((err, res) => {
        if (err) {
          console.error(err);
          this.setState({ error: err, loading: false });
        } else {
          this.setState({ data: JSON.parse(res.text).agrument_posts, loading: false });
        }
      });
  }

  componentWillUnmount() {
    this.dataRequest.abort();
  }

  lazyLoadMore() {
    if (!this.state.data) {
      return;
    }

    const lastId = this.state.data[this.state.data.length - 1].id;
    if (lastId === this.lastFetchedId) {
      return;
    }

    // TODO: remove -1 from this
    this.lastFetchedId = this.lastPostId - 1;
    this.dataRequest = request
      .get(`/data/agrument.json?start_id=${this.lastPostId + 1}`)
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

  render() {
    let content = null;
    if (this.state.loading) {
      content = <div>TODO: Spinner!</div>;
    } else if (this.state.error) {
      content = <div>{this.state.error.toString()}</div>;
    } else {
      content = this.state.data.map((post, i) => (
        <WaypointBlock key={i} onEnterFunc={() => window.history.replaceState({}, '', `/${post.id}`)}>
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
