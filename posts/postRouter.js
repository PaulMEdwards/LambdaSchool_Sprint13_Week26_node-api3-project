const express = require('express');

const router = express.Router();

const postDb = require('./postDb.js');

const apiBase = '/api/posts';

// custom middleware

const validatePostId = require('../middleware/validatePostId');
const validatePost = require('../middleware/validatePost');

router.post('/', validatePost, (req, res) => {
  const { postId } = req.params;

  if (!req.body.text) {
    res.status(400).json({ success: false, errorMessage: "Please provide text for the post." });
  } else {
    // postDb.getById(postId)
    //   .then(post => {
    //     if (post) {
          postDb.insert(req.body)
            .then(post => {
              console.log(`POST ${apiBase}/:postId/post insert(${postId}): \n`, post);
              res.status(201).json({ success: true, post: post });
            })
            .catch(err => {
              res.status(500).json({ success: false, errorMessage: "There was an error while saving the post to the database." });
            });
      //   } else {
      //     res.status(404).json({ success: false, errorMessage: "The post with the specified ID does not exist." });
      //   }
      // });
  }
});

router.get('/', (req, res) => {
  postDb.get()
    .then(posts => {
      console.log(`GET ${apiBase}/ get():\n`, posts);
      res.status(200).json({ success: true, posts: posts });
    })
    .catch(err => {
      res.status(500).json({ success: false, errorMessage: "The posts information could not be retrieved."});
    });
});

router.get('/:id', validatePostId, (req, res) => {
  const postId = req.params.id;

  postDb.getById(postId)
    .then(post => {
      console.log(`GET ${apiBase}/:postId getById(${postId}): \n`, post);
      if (post) {
        res.status(200).json({ success: true, post: post });
      } else {
        res.status(404).json({ success: false, errorMessage: "The post with the specified ID does not exist." });
      }
    })
    .catch(err => {
      res.status(500).json({ success: false, errorMessage: "The post information could not be retrieved." });
    });
});

router.put('/:id', validatePostId, validatePost, (req, res) => {
  const postId = req.params.id;

  if (!req.body.text) {
    res.status(400).json({ success: false, errorMessage: "Please provide text for the post." });
  } else {
    postDb.getById(postId)
      .then(post => {
        if (post) {
          postDb.update(postId, req.body)
            .then(postIdUpdated => {
              console.log(`PUT ${apiBase}/:id update(${postId}): \n`, postIdUpdated);
              if (postIdUpdated) {
                res.status(200).json({ success: true, postIdUpdated: parseInt(postId, 10) });
              }
            })
            .catch(err => {
              res.status(500).json({ success: false, errorMessage: "The post information could not be modified." });
            });
        } else {
          res.status(404).json({ success: false, errorMessage: "The post with the specified ID does not exist." });
        }
      });
  }
});

router.delete('/:id', validatePostId, (req, res) => {
  const postId = req.params.id;

  postDb.getById(postId)
    .then(post => {
      if (post) {
        postDb.remove(postId, req.body)
          .then(postIdRemoved => {
            console.log(`DELETE ${apiBase}/:postId remove(${postId}): \n`, postIdRemoved);
            if (postIdRemoved) {
              res.status(200).json({ success: true, postIdRemoved: parseInt(postId, 10) });
            }
          })
          .catch(err => {
            res.status(500).json({ success: false, errorMessage: "The post could not be removed." });
          });
      } else {
        res.status(404).json({ success: false, errorMessage: "The post with the specified ID does not exist." });
      }
    });
});

module.exports = router;
