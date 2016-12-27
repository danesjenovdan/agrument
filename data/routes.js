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
    res.json({
      agrument_posts: [
        {
          id: postId,
          title: `Title: ${postId}`,
          date: dateObj.toISOString(),
          articleHTML: '<p>Paragraph with <a href="link">link</a></p>',
          imageURL: 'http://placehold.it/300x100',
          imageSource: 'placehold.it',
        },
      ],
    });
  });
};
