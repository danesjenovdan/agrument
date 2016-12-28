import React, { PropTypes } from 'react';
import request from 'superagent';
import Waypoint from 'react-waypoint';
import { concat } from 'lodash';
import { browserHistory } from 'react-router';
import Article from './Article';
import WaypointBlock from '../WaypointBlock';
import Spinner from '../Spinner';
import Button from '../FormControl/Button';
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
    let url = '/data/agrument.json';
    if (this.props.params.date) {
      url += `?date=${this.props.params.date}`;
    }

    this.dataRequest = request
      .get(url)
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
      console.log(event.action);
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

  lazyLoadMore() {
    if (this.state.loading || !this.state.shouldLoadBelow) {
      return;
    }

    this.setState({ loading: true });

    const lastId = this.state.data[this.state.data.length - 1].id;
    this.dataRequest = request
      .get(`/data/agrument.json?id=${lastId - 1}`)
      .end((err, res) => {
        this.setState({ loading: false });
        if (err) {
          if (err.status !== 404) {
            console.error(err);
            this.setState({ error: true });
          } else {
            this.setState({ shouldLoadBelow: false });
          }
        } else {
          const json = JSON.parse(res.text);
          const mergedData = concat(this.state.data, json.agrument_posts);
          this.setState({ data: mergedData });
          this.dataRequest = null;
        }
      });
  }

  lazyLoadAbove() {
    if (this.state.loading || !this.state.shouldLoadAbove || this.oldHeight) {
      return;
    }

    this.setState({ loading: true });

    const firstId = this.state.data[0].id;
    this.dataRequest = request
      .get(`/data/agrument.json?id=${firstId + 1}`)
      .end((err, res) => {
        this.setState({ loading: false });
        if (err) {
          if (err.status !== 404) {
            console.error(err);
            this.setState({ error: true });
          } else {
            this.setState({ shouldLoadAbove: false });
          }
        } else {
          const json = JSON.parse(res.text);
          const mergedData = concat(json.agrument_posts, this.state.data);
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
      if (this.state.shouldLoadAbove) {
        if (this.state.loading) {
          content.unshift(<Spinner key="spinner-above" />);
        } else {
          content.unshift(<Button key="load-above" onClickFunc={() => this.lazyLoadAbove()} value="^ Naloži ^" />);
        }
      }
      if (this.state.shouldLoadBelow) {
        if (this.state.loading) {
          content.push(<Spinner key="spinner-below" />);
        } else {
          content.push(<Waypoint key="load-below" onEnter={() => this.lazyLoadMore()} bottomOffset={-100} />);
        }
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

Feed.propTypes = {
  params: PropTypes.shape({ date: PropTypes.string }),
};

export default Feed;
