function dayOfYearFromDate(date) {
  const first = new Date(date.getFullYear(), 0, 1);
  return Math.ceil((date - first) / 1000 / 60 / 60 / 24, 0);
}

function dateFromDayOfYear(day) {
  const date = new Date(new Date().getFullYear(), 0); // initialize a date in `year-01-01`
  return new Date(date.setDate(day)); // add the number of days
}

module.exports = function setupRoutes(app) {
  // Agrument articles
  app.get('/data/agrument.json', (req, res) => {
    let postId;
    let dateObj;
    if (req.query.id) {
      postId = +req.query.id;
      dateObj = dateFromDayOfYear(postId % 365);
    } else {
      if (req.query.date) {
        dateObj = new Date(req.query.date.split('.').reverse().join('-'));
      } else {
        dateObj = new Date();
      }
      postId = dayOfYearFromDate(dateObj);
    }
    if (postId < 0 || postId > 365) {
      res.status(404).send('Not found');
      return;
    }
    res.json({
      agrument_posts: [
        {
          id: postId,
          title: `Title: ${postId}`,
          date: dateObj.toISOString(),
          content: '<p>Paragraph with <a href="link">link</a></p>',
          description: `Short desc of title ${postId} for use in meta and og tags`,
          imageURL: `http://placehold.it/300x${(Math.random() * 100) + 50}`,
          imageSource: 'placehold.it',
          iframeURL: null,
          iframeHeight: '25%', // % of width
        },
      ],
    });
  });
};
