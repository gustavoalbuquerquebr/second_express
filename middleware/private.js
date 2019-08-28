const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY;

// NOTE: middleware to deny access to users that are not logged in
function privateRoute(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.send("No user logged in");
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    next();
  } catch {
    res.send("Tempered or expired token");
  }
}

module.exports = privateRoute;
