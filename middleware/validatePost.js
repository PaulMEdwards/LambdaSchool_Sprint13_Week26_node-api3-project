/**
 * - `validatePost` validates the `body` on a request to create a new post
 * - if the request `body` is missing, cancel the request and respond with status `400` and `{ errorMessage: "missing post data" }`
 * - if the request `body` is missing the required `text` field, cancel the request and respond with status `400` and `{ errorMessage: "missing required text field" }`
 */
function validatePost(req, res, next) {
  console.log(`validatePost`);
  if (!req.body) {
    console.log(`validatePost: post is invalid`);
    return res.status(400).json({ success: false, errorMessage: "Missing post data!" });
  } else if (!req.body.text) {
    console.log(`validatePost: post is invalid`);
    return res.status(400).json({ success: false, errorMessage: "Missing required text field!" });
  } else {
    console.log(`validatePost: post is valid`);
    next();
  };
}

module.exports = validatePost;