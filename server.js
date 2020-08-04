const express = require('express');

const server = express();
server.use(express.json());

//custom middleware

const logger = require('./middleware/logger');

server.use(logger);

const readme = require('./readme');

server.get('/', (req, res) => {
  res.send(readme);
});

const userRouter = require('./users/userRouter.js');
server.use('/api/users', userRouter);

const postRouter = require('./posts/postRouter.js');
server.use('/api/posts', postRouter);

module.exports = server;
