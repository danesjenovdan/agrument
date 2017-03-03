import React, { PropTypes } from 'react';
import InputImmutable from '../FormControl/InputImmutableAutoFocus';
import PulseIconButton from '../Social/PulseIconButton';
import { shareOnFacebook, shareOnTwitter, shareOnGooglePlus } from '../../utils/social';
import { toSloDateString } from '../../utils/date';
import { shortenUrl } from '../../utils/shortener';

class Article extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      longUrl: `http://agrument.danesjenovdan.si/${toSloDateString(props.data.date)}`,
      shortUrl: '',
    };
  }

  componentDidMount() {
    this.dataRequest = shortenUrl(this.state.longUrl, (shortUrl) => {
      this.setState({ shortUrl });
      this.dataRequest = null;
    });
  }

  componentWillUnmount() {
    if (this.dataRequest) {
      this.dataRequest.abort();
    }
  }

  render() {
    const date = new Date(this.props.data.date).toLocaleDateString('sl');
    let cover;
    if (!this.props.data.iframeURL) {
      cover = <img src={this.props.data.imageURL} className="img-responsive agrument__image" alt={this.props.data.imageSource} />;
    } else {
      cover = (
        <div className="embed-responsive" style={{ paddingBottom: this.props.data.iframeHeight }}>
          <iframe className="embed-responsive-item" src={this.props.data.iframeURL} />
        </div>
      );
    }
    return (
      <article className="agrument__article" id={`post-${this.props.data.id}`} data-id={this.props.data.id}>
        <h1 className="agrument__title">{this.props.data.title}</h1>
        {cover}
        <div className="agrument__source"><a href={this.props.data.imageURL}>{this.props.data.imageSource}</a></div>
        <div className="row">
          <div className="col-md-2">
            <div className="agrument__date">{date}</div>
            <div className="agrument__copy-text">Skopiraj povezavo!</div>
            <div className="agrument__copy-input">
              <InputImmutable value={this.state.shortUrl || this.state.longUrl} />
            </div>
            <div className="agrument_social-buttons">
              <PulseIconButton iconName="facebook" onClick={() => shareOnFacebook(this.props.data.title, this.state.longUrl)} />
              <PulseIconButton iconName="twitter" onClick={() => shareOnTwitter(this.props.data.title, this.state.longUrl)} />
              <PulseIconButton iconName="googleplus" onClick={() => shareOnGooglePlus(this.props.data.title, this.state.longUrl)} />
            </div>
          </div>
          <div className="col-md-10">
            <div className="agrument__text" dangerouslySetInnerHTML={{ __html: this.props.data.content }} />
          </div>
        </div>
      </article>
    );
  }
}

Article.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    date: PropTypes.number,
    content: PropTypes.string,
    imageURL: PropTypes.string,
    imageSource: PropTypes.string,
    iframeURL: PropTypes.string,
    iframeHeight: PropTypes.string,
  }).isRequired,
};

export default Article;
