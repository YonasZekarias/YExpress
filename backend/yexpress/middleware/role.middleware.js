const role = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user) {
      console.log('role is',requiredRole);
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (req.user.role !== requiredRole) {
      return res.status(403).json({
        message: 'Forbidden: Insufficient permissions',
      });
    }

    next();
  };
};

module.exports = role;
