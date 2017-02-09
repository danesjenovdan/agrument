function requireLoggedIn(req, res, next) {
  if (!req.user) {
    res.status(401).json({
      error: 'Unauthorized',
    });
  } else {
    next();
  }
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.group !== 'admin') {
    res.status(401).json({
      error: 'Unauthorized',
    });
  } else {
    next();
  }
}

export {
  requireLoggedIn,
  requireAdmin,
};
