/**
 * - `validatePostId` validates the post id on every request that expects a post id parameter
 * - if the `id` parameter is valid, store that post object as `req.post`
 * - if the `id` parameter does not match any post id in the database, cancel the request and respond with status `404` and `{ errorMessage: "invalid post id" }`
 */
function validatePostId(req, res, next) {
  const id = req.params.id;
  console.log(`validatePostId -> id`, id);

  const db = require('../posts/postDb.js');

  db.get()
    .then(posts => {
      db.getById(id)
        .then(post => {
          if (post) {
            req.post = post;
            console.log(`validatePostId -> post\n`, post);
            next();
          } else {
            res.status(404).json({ success: false, errorMessage: "Invalid post id!" });
          }
        })
        .catch(errPost => {
          res.status(500).json({ success: false, errorMessage: `Error fetching post with ID ${id}!` });
        });
    })
    .catch(errPosts => {
      res.status(500).json({ success: false, errorMessage: `Error fetching posts!` });
    })
}

module.exports = validatePostId;
