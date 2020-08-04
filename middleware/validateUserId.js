/**
 * - `validateUserId` validates the user id on every request that expects a user id parameter
 * - if the `id` parameter is valid, store that user object as `req.user`
 * - if the `id` parameter does not match any user id in the database, cancel the request and respond with status `404` and `{ errorMessage: "invalid user id" }`
 */
function validateUserId(req, res, next) {
  const id = req.params.id;
  console.log(`validateUserId -> id`, id);

  const db = require('../users/userDb.js');

  db.get()
    .then(users => {
      db.getById(id)
        .then(user => {
          console.log(`validateUserId -> user\n`, user);
          if (user) {
            req.user = user;
            next();
          } else {
            res.status(404).json({ success: false, errorMessage: "Invalid user id!" });
          }
        })
        .catch(errUser => {
          res.status(500).json({ success: false, errorMessage: `Error fetching user with ID ${id}!` });
        });
    })
    .catch(errUsers => {
      res.status(500).json({ success: false, errorMessage: `Error fetching users!` });
    })
}

module.exports = validateUserId;
