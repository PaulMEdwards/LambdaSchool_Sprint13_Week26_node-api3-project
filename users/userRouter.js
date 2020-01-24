const express = require('express');

const router = express.Router();

const userDb = require('./userDb.js');
const postDb = require('../posts/postDb.js');

const apiBase = '/api/users';

//custom middleware

const validateUserId = require('../middleware/validateUserId');
const validateUser = require('../middleware/validateUser.js');
const validatePost = require('../middleware/validatePost');

router.post('/', validateUser, (req, res) => {
  if (!req.body.name) {
    res.status(400).json({ success: false, errorMessage: "Please provide name for the user." });
  } else {
    userDb.insert(req.body)
      .then(user => {
        console.log(`POST ${apiBase}/ insert(): \n`, user);
        res.status(201).json({ success: true, user: user });
      })
      .catch(err => {
        res.status(500).json({ success: false, errorMessage: "There was an error while saving the user to the database." });
      });
  }
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  const userId = req.params.id;

  if (!req.body.text) {
    res.status(400).json({ success: false, errorMessage: "Please provide text for the user post." });
  } else {
    userDb.getById(userId)
      .then(user => {
        console.log(`POST ${apiBase}/:userId user:\n`, user);
        if (user) {
          req.body.user_id = userId;
          console.log(`POST ${apiBase}/:userId/posts req.body: \n`, req.body);
          postDb.insert(req.body)
            .then(post => {
              console.log(`POST ${apiBase}/:userId/posts insert(${userId}): \n`, post);
              res.status(201).json({ success: true, post: post });
            })
            .catch(err => {
              res.status(500).json({ success: false, errorMessage: "There was an error while saving the user post to the database." });
            });
        } else {
          res.status(404).json({ success: false, errorMessage: "The user with the specified ID does not exist." });
        }
      })
      .catch(err => {
        res.status(500).json({ success: false, errorMessage: "There was an error while fetching the user." });
      });
  }
});

router.get('/', (req, res) => {
  userDb.get()
    .then(users => {
      console.log(`GET ${apiBase}/ get():\n`, users);
      res.status(200).json({ success: true, users: users });
    })
    .catch(err => {
      res.status(500).json({ success: false, errorMessage: "The users information could not be retrieved."});
    });
});

router.get('/:id', validateUserId, (req, res) => {
  console.log(`TCL: req.params`, req.params);
  const userId = req.params.id;

  userDb.getById(userId)
    .then(user => {
      console.log(`GET ${apiBase}/:userId getById(${userId}): \n`, user);
      if (user) {
        res.status(200).json({ success: true, user: user });
      } else {
        res.status(404).json({ success: false, errorMessage: "The user with the specified ID does not exist." });
      }
    })
    .catch(err => {
      res.status(500).json({ success: false, errorMessage: "The user information could not be retrieved." });
    });
});

router.get('/:id/posts', validateUserId, (req, res) => {
  const userId = req.params.id;

  userDb.getById(userId)
    .then(user => {
      if (user) {
        userDb.getUserPosts(userId)
        .then(posts => {
          console.log(`GET ${apiBase}/:userId/posts getUserPosts(${userId}): \n`, posts);
          if (posts) {
            res.status(200).json({ success: true, posts: posts });
          } else {
            res.status(404).json({ success: false, errorMessage: "The user has no posts." });
          }
        })
        .catch(err => {
          res.status(500).json({ success: false, errorMessage: "The user posts information could not be retrieved." });
        });
      } else {
        res.status(404).json({ success: false, errorMessage: "The user with the specified ID does not exist." });
      }
    })
});

router.put('/:id', validateUserId, validateUser, (req, res) => {
  const userId = req.params.id;

  if (!req.body.name) {
    res.status(400).json({ success: false, errorMessage: "Please provide name for the user." });
  } else {
    userDb.getById(userId)
      .then(user => {
        if (user) {
          userDb.update(userId, req.body)
            .then(userIdUpdated => {
              console.log(`PUT ${apiBase}/:id update(${userId}):`, userIdUpdated); //TODO why does this return 1?
              if (userIdUpdated) {
                res.status(200).json({ success: true, userIdUpdated: parseInt(userId, 10) });
              }
            })
            .catch(err => {
              res.status(500).json({ success: false, errorMessage: "The user information could not be modified." });
            });
        } else {
          res.status(404).json({ success: false, errorMessage: "The user with the specified ID does not exist." });
        }
      });
  }
});

router.delete('/:id', validateUserId, (req, res) => {
  const userId = req.params.id;

  userDb.getById(userId)
    .then(user => {
      if (user) {
        userDb.remove(userId, req.body)
          .then(userIdRemoved => {
            console.log(`DELETE ${apiBase}/:userId remove(${userId}):`, userIdRemoved); //TODO why does this return 1?
            if (userIdRemoved) {
              res.status(200).json({ success: true, userIdRemoved: parseInt(userId, 10) });
            }
          })
          .catch(err => {
            res.status(500).json({ success: false, errorMessage: "The user could not be removed." });
          });
      } else {
        res.status(404).json({ success: false, errorMessage: "The user with the specified ID does not exist." });
      }
    });
});

module.exports = router;
