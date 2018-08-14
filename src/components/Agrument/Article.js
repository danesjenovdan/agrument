import React from 'react';
import PropTypes from 'prop-types';
import InputImmutable from '../FormControl/InputImmutableAutoFocus';
import PulseIconButton from '../Social/PulseIconButton';
import { shareOnFacebook, shareOnTwitter, shareOnGooglePlus } from '../../utils/social';
import { toSloDateString } from '../../utils/date';
import { shortenUrl } from '../../utils/shortener';

class Article extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      longUrl: `https://agrument.danesjenovdan.si/${toSloDateString(props.data.date)}`,
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
    if (!this.props.data.embedCode) {
      cover = <img src={this.props.data.imageURL} className="img-responsive agrument__image" alt={this.props.data.imageCaption} />;
    } else {
      cover = (
        <div
          className="embed-responsive"
          style={{ paddingBottom: this.props.data.embedHeight }}
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: this.props.data.embedCode }}
        />
      );
    }
    return (
      <article className="agrument__article" id={`post-${this.props.data.id}`} data-id={this.props.data.id}>
        <h1 className="agrument__title">{this.props.data.title}</h1>
        {cover}
        <div className="agrument__source"><a href={this.props.data.imageCaptionURL} target="_blank" rel="noopener noreferrer">{this.props.data.imageCaption}</a></div>
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
            <div
              className="agrument__text"
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: this.props.data.content }}
            />
          </div>
        </div>
      </article>
    );
  }
}

Article.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    date: PropTypes.number.isRequired,
    content: PropTypes.string.isRequired,
    imageURL: PropTypes.string.isRequired,
    imageCaption: PropTypes.string.isRequired,
    imageCaptionURL: PropTypes.string.isRequired,
    embedCode: PropTypes.string,
    embedHeight: PropTypes.string,
  }).isRequired,
};

export default Article;
