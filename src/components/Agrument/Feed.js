import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import Waypoint from 'react-waypoint';
import { withRouter } from 'react-router-dom';
import { concat, last } from 'lodash';
import Article from './Article';
import WaypointBlock from '../WaypointBlock';
import Spinner from '../Spinner';
// import Button from '../FormControl/Button';
import RenderSpinner from '../../hoc/RenderSpinner';
import { getInitialPost, getOlderPost, getNewerPost } from '../../utils/agrument';
import { toSloDateString } from '../../utils/date';

class Feed extends React.Component {
  constructor(props) {
    super(props);

    const { location } = props;
    this.initialDate = last(location.pathname.split('/'));

    this.state = {
      loading: true,
      error: false,
      data: [],
      shouldLoadAbove: !!this.initialDate,
      shouldLoadBelow: true,
      activePost: null,
    };

    if (props.staticContext) {
      if (props.staticContext.data && props.staticContext.data.post) {
        this.state.data = [props.staticContext.data.post];
        this.state.activePost = props.staticContext.data.post;
      }
    }
  }

  componentDidMount() {
    const { history } = this.props;

    if (!this.state.activePost) {
      this.dataRequest = getInitialPost(this.initialDate).end(this.setInitialArticleState);
    }

    this.cancelListen = history.listen((event) => {
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

    this.lastScrollTop = document.documentElement.scrollTop;
    this.lastScrollWasUp = false;
    this.scrollListener = () => {
      this.lastScrollWasUp = document.documentElement.scrollTop < this.lastScrollTop;
      this.lastScrollTop = document.documentElement.scrollTop;
    };

    window.addEventListener('scroll', this.scrollListener);
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
      document.documentElement.scrollTop += diff;
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
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
    }
  }

  setInitialArticleState = (err, res) => {
    this.setState({ loading: false });
    this.dataRequest = null;

    if (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      this.setState({ error: true });
    } else if (!res.body.post) {
      // eslint-disable-next-line no-console
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
      // eslint-disable-next-line no-console
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
    if (this.lastScrollWasUp
      && !this.state.loading
      && this.state.shouldLoadAbove
      && !this.oldHeight) {
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
    const newPath = post ? `/${toSloDateString(post.date)}` : '/';
    if (window.location.pathname !== newPath) {
      this.props.history.push(newPath, { postId: post ? +post.id : 0 });
      this.setState({ activePost: post });
    }
  }

  render() {
    if (this.state.error) {
      return <div>Napaka :(</div>;
    }

    const content = [];
    if (this.state.data.length) {
      // if (this.state.shouldLoadAbove) {
      //   content.push((
      //     <div key="load-above" className="agrument__spinner-container" style={{ height: 50 }}>
      //       <RenderSpinner isLoading={this.state.loading}>
      //         {() => (
      //           <Waypoint onEnter={() => this.lazyLoadAbove()} />
      //         )}
      //       </RenderSpinner>
      //     </div>
      //   ));
      // }

      content.push((
        <Waypoint
          key="top-enter-waypoint"
          onEnter={() => this.changeActiveArticle()}
          topOffset="100px"
        />
      ));
      content.push((
        <Waypoint
          key="top-leave-waypoint"
          onLeave={() => this.changeActiveArticle(this.state.data[0])}
        />
      ));

      const articles = this.state.data.map(post => (
        <WaypointBlock key={post.id} onEnterFunc={() => this.changeActiveArticle(post)}>
          <Article data={post} />
        </WaypointBlock>
      ));
      content.push(...articles);

      if (this.state.shouldLoadBelow) {
        content.push((
          <div key="load-below" className="agrument__spinner-container">
            <RenderSpinner isLoading={this.state.loading}>
              {() => (
                <Waypoint onEnter={() => this.lazyLoadBelow()} bottomOffset={-100} />
              )}
            </RenderSpinner>
          </div>
        ));
      }
    } else if (this.state.loading) {
      content.push((
        <div key="load-main" className="agrument__spinner-container">
          <Spinner />
        </div>
      ));
      // TODO: use RenderSpinner HOC
    } else {
      content.push((
        <div key="load-main" className="agrument__spinner-container">
          <h1>NAPAKA :(</h1>
        </div>
      ));
    }
    const meta = this.state.activePost ? (
      <Helmet>
        <title>{this.state.activePost.title}</title>
        <meta name="description" content={this.state.activePost.description} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={this.state.activePost.title} />
        <meta property="og:description" content={this.state.activePost.description} />
        <meta property="og:image" content={this.state.activePost.imageURL} />
        <meta name="twitter:creator" content="@danesjenovdan" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={this.state.activePost.title} />
        <meta name="twitter:description" content={this.state.activePost.description} />
        <meta name="twitter:image" content={this.state.activePost.imageURL} />
      </Helmet>
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
  location: PropTypes.shape().isRequired,
  history: PropTypes.shape().isRequired,
  staticContext: PropTypes.shape(),
};

Feed.defaultProps = {
  staticContext: {},
};

export default withRouter(Feed);
