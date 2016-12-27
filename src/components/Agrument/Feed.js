import React from 'react';
import request from 'superagent';
import Waypoint from 'react-waypoint';
import { concat } from 'lodash';
import { browserHistory } from 'react-router';
import Article from './Article';
import WaypointBlock from '../WaypointBlock';
import Spinner from '../Spinner';
import { formatDateForURL } from '../../actions/agrument';

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
        this.setState({ loading: false });
        if (err) {
          console.error(err);
          this.setState({ error: err });
        } else {
          this.setState({ data: JSON.parse(res.text).agrument_posts });
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
    if (this.cancelListen) {
      this.cancelListen();
    }
  }

  lazyLoadMore() {
    if (this.state.loading) {
      return;
    }

    this.setState({ loading: true });

    const lastId = this.state.data[this.state.data.length - 1].id;
    this.dataRequest = request
      .get(`/data/agrument.json?id=${lastId - 1}`)
      .end((err, res) => {
        this.setState({ loading: false });
        if (err) {
          console.error(err);
          this.setState({ error: true });
        } else {
          const json = JSON.parse(res.text);
          const mergedData = concat(this.state.data, json.agrument_posts);
          this.setState({ data: mergedData });
          this.dataRequest = null;
        }
      });
  }

  render() {
    let content = [];
    if (this.state.error) {
      content = <div>NAPAKA!</div>;
    } else if (this.state.data) {
      content = this.state.data.map((post, i) => (
        <WaypointBlock key={i} onEnterFunc={event => changeURLOnScroll(event, post)}>
          <Article data={post} />
        </WaypointBlock>
      ));
      if (this.state.loading) {
        content.push(<Spinner key="spinner" />);
      } else {
        content.push(<Waypoint key="waypoint" onEnter={() => this.lazyLoadMore()} bottomOffset={-100} />);
      }
    } else if (this.state.loading) {
      content = <Spinner />;
    }
    return (
      <div className="agrument__feed">
        {content}
      </div>
    );
  }
}

export default Feed;
