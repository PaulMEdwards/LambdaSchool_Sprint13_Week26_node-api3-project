const db = require('../data/dbConfig.js');

module.exports = {
  get,
  getById,
  getUserPosts,
  insert,
  update,
  remove,
};

function get() {
  return db('users');
}

function getById(id) {
  console.log(`userDb: getById -> id`, id);
  const u = db('users')
    // .where({ id })
    // .where({ id: Number(id) })
    // .where({ Number(id) })
    .where('id', Number(id))
    .first();
  // console.log(`userDb: getById -> user\n`, u);
  return u;
}

function getUserPosts(userId) {
  return db('posts as p')
    .join('users as u', 'u.id', 'p.user_id')
    .select('p.id', 'p.text', 'u.id as user_id', 'u.name as user_name')
    .where('p.user_id', Number(userId));
}

function insert(user) {
  console.log(`userDb: insert -> user\n`, user);
  return db('users')
    .insert(user)
      .then(ids => {
        console.log(`userDb: insert -> ids`, ids);
        // return getById(ids[0]);
        // return getById({ id: Number(ids[0]) });
        return getById(Number(ids[0]));
      });
}

function update(id, changes) {
  return db('users')
    .where('id', Number(id))
    .update(changes);
}

function remove(id) {
  return db('users')
    .where('id', Number(id))
    .del();
}
