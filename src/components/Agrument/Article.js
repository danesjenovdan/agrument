import React, { PropTypes } from 'react';
import InputImmutable from '../FormControl/InputImmutableAutoFocus';
import PulseIconButton from '../Social/PulseIconButton';
import { shareOnFacebook, shareOnTwitter, shareOnGooglePlus } from '../../actions/social';

const Article = ({ data }) => {
  const date = new Date(data.date).toLocaleDateString('sl');
  return (
    <article className="agrument__article">
      <h1 className="agrument__title">{data.title}</h1>
      <img src={data.imageURL} className="img-responsive agrument__image" alt={data.imageSource} />
      <div className="agrument__source"><a href={data.imageURL}>{data.imageSource}</a></div>
      <div className="row">
        <div className="col-md-2">
          <div className="agrument__date">{date}</div>
          <div className="agrument__copy-text">Skopiraj povezavo!</div>
          <div className="agrument__copy-input">
            <InputImmutable value={data.shortLink} />
          </div>
          <div className="agrument_social-buttons">
            <PulseIconButton iconName="facebook" onClickFunc={() => shareOnFacebook(data.title, data.shortLink)} />
            <PulseIconButton iconName="twitter" onClickFunc={() => shareOnTwitter(data.title, data.shortLink)} />
            <PulseIconButton iconName="googleplus" onClickFunc={() => shareOnGooglePlus(data.title, data.shortLink)} />
          </div>
        </div>
        <div className="col-md-10">
          <div className="agrument__text" dangerouslySetInnerHTML={{ __html: data.articleHTML }} />
        </div>
      </div>
    </article>
  );
};

Article.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string,
    date: PropTypes.string,
    articleHTML: PropTypes.string,
    imageURL: PropTypes.string,
    imageSource: PropTypes.string,
    shortLink: PropTypes.string,
  }),
};

export default Article;
