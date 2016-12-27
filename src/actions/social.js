function safeOpen(url) {
  const w = window.open(undefined, '_blank');
  w.opener = null;
  w.location = url;
}

function shareOnTwitter(title, url) {
  const text = `${title} ${url}`;
  const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
  safeOpen(shareUrl);
}

function shareOnFacebook(title, url) {
  const shareUrl = `https://www.facebook.com/dialog/share?app_id=301375193309601&display=popup&href=${encodeURIComponent(url)}&redirect_uri=${encodeURIComponent(url)}&ref=responsive`;
  safeOpen(shareUrl);
}

function shareOnGooglePlus(title, url) {
  const text = `${title} ${url}`;
  const shareUrl = `https://plus.google.com/share?url=${encodeURIComponent(text)}`;
  safeOpen(shareUrl);
}

/*
// TODO: tracking/analytics
ga('send', {
  'hitType': 'event',
  'eventCategory': 'agrument',
  'eventAction': 'share',
  'eventLabel': 'google_plus'
});
*/

export {
  shareOnTwitter,
  shareOnFacebook,
  shareOnGooglePlus,
};
