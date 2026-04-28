export function authorizeRoles(...roles) {
  return function roleAuthorizer(req, res, next) {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: 'Forbidden: insufficient permission' });
    }
    return next();
  };
}
