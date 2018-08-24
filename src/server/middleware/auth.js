function requireLoggedIn(req, res, next) {
  if (!req.user) {
    res.status(403).json({
      error: 'Forbidden',
    });
  } else {
    next();
  }
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.group !== 'admin') {
    res.status(403).json({
      error: 'Forbidden',
    });
  } else {
    next();
  }
}

export {
  requireLoggedIn,
  requireAdmin,
};
