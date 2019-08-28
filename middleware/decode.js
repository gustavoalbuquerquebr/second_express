const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY;

// NOTE: if there's a key 'token' in cookie, this middleware will decoded it and set its userid property to req.userid
function decodeToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    next();
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.userid = decoded.userid;
    next();
  } catch {
    return res.send("Token was tempered or expired");
  }
}

module.exports = decodeToken;
