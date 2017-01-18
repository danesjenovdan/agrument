import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';
import Waypoint from 'react-waypoint';
import { concat } from 'lodash';
import { browserHistory } from 'react-router';
import { autobind } from 'core-decorators';
import Article from './Article';
import WaypointBlock from '../WaypointBlock';
import Spinner from '../Spinner';
import Button from '../FormControl/Button';
import { formatDateForURL, getInitialPost, getOlderPost, getNewerPost } from '../../actions/agrument';

class Feed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      error: false,
      data: [],
      shouldLoadAbove: !!this.props.params.date,
      shouldLoadBelow: true,
      activePost: null,
    };
  }

  componentDidMount() {
    this.dataRequest = getInitialPost(this.props.params.date).end(this.setInitialArticleState);

    this.cancelListen = browserHistory.listen((event) => {
      if (event.state && event.state.postId && event.action === 'POP') {
        const elem = document.querySelector(`#post-${event.state.postId}`);
        if (elem) {
          this.dontChangeURLOnScroll = true;
          setTimeout(() => {
            elem.scrollIntoView(true);
            this.dontChangeURLOnScroll = false;
          }, 0);
        }
      }
    });
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.data.length && this.state.data.length !== nextState.data.length) {
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
    } else if (!res.body.post) {
      console.error('Initial post not found!');
      this.setState({ error: true });
    } else {
      this.setState({ data: [res.body.post], activePost: res.body.post });
    }
  }

  updateArticleState(err, res, prepend) {
    this.setState({ loading: false });
    this.dataRequest = null;

    if ((err && err.status === 404) || (!err && !res.body.post)) {
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
        mergedData = concat(res.body.post, this.state.data);
      } else {
        mergedData = concat(this.state.data, res.body.post);
      }
      this.setState({ data: mergedData });
    }
  }

  lazyLoadBelow() {
    if (!this.state.loading && this.state.shouldLoadBelow) {
      this.setState({ loading: true });
      const lastDate = this.state.data[this.state.data.length - 1].date;
      this.dataRequest = getOlderPost(lastDate)
        .end((err, res) => this.updateArticleState(err, res, false));
    }
  }

  lazyLoadAbove() {
    if (!this.state.loading && this.state.shouldLoadAbove && !this.oldHeight) {
      this.setState({ loading: true });
      const firstDate = this.state.data[0].date;
      this.dataRequest = getNewerPost(firstDate)
        .end((err, res) => this.updateArticleState(err, res, true));
    }
  }

  changeActiveArticle(post) {
    if (this.dontChangeURLOnScroll) {
      return;
    }
    const newPath = `/${formatDateForURL(post.date)}`;
    if (window.location.pathname !== newPath) {
      browserHistory.push({ pathname: newPath, state: { postId: +post.id } });
      this.setState({ activePost: post });
    }
  }

  render() {
    const content = [];
    if (this.state.data.length) {
      if (this.state.shouldLoadAbove) {
        content.push(<div key="load-above" className="agrument__spinner-container">
          {this.state.loading ? <Spinner /> : <Button key="load-above" onClickFunc={() => this.lazyLoadAbove()} value="^ Naloži ^" />}
        </div>);
      }

      const articles = this.state.data.map(post => (
        <WaypointBlock key={post.id} onEnterFunc={() => this.changeActiveArticle(post)}>
          <Article data={post} />
        </WaypointBlock>
      ));
      content.push(...articles);

      if (this.state.shouldLoadBelow) {
        content.push(<div key="load-below" className="agrument__spinner-container">
          {this.state.loading ?
            <Spinner /> :
            <Waypoint onEnter={() => this.lazyLoadBelow()} bottomOffset={-100} />}
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
    const meta = this.state.activePost ? (
      <Helmet
        title={this.state.activePost.title}
        meta={[
          { name: 'description', content: this.state.activePost.description },
          { property: 'og:title', content: this.state.activePost.title },
          { property: 'og:type', content: 'article' },
          { property: 'og:description', content: this.state.activePost.description },
          { property: 'og:image', content: this.state.activePost.imageURL },
        ]}
      />
    ) : null;
    return (
      <div className="agrument__feed">
        {meta}
        {content}
      </div>
    );
  }
}

Feed.propTypes = {
  params: PropTypes.shape({ date: PropTypes.string }),
};

export default Feed;
