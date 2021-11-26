const checkJwt = require("express-jwt");
module.exports = checkJwt({
  secret: process.env.JWT_SECRET_TEXT,
  algorithms: ["HS256"],
});
