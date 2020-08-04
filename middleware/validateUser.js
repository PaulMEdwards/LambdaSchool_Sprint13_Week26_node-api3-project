/**
 * - `validateUser` validates the `body` on a request to create a new user
 * - if the request `body` is missing, cancel the request and respond with status `400` and `{ errorMessage: "missing user data" }`
 * - if the request `body` is missing the required `name` field, cancel the request and respond with status `400` and `{ errorMessage: "missing required name field" }`
 */
function validateUser(req, res, next) {
  console.log(`validateUser`);
  if (!req.body) {
    console.log(`validateUser: user is invalid`);
    return res.status(400).json({ success: false, errorMessage: "Missing user data!" });
  } else if (!req.body.name) {
    console.log(`validateUser: user is invalid`);
    return res.status(400).json({ success: false, errorMessage: "Missing required name field!" });
  } else {
    console.log(`validateUser: user is valid`);
    next();
  };
}

module.exports = validateUser;