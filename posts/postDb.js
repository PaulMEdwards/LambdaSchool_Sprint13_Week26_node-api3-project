const db = require('../data/dbConfig.js');

module.exports = {
  get,
  getById,
  insert,
  update,
  remove,
};

function get() {
  return db('posts');
}

function getById(id) {
  // return db('posts')
  //   .where({ id: Number(id) })
  //   .first();
  return db('posts as p')
    .join('users as u', 'u.id', 'p.user_id')
    .select('p.id', 'p.text', 'u.id as user_id', 'u.name as user_name')
    .where('p.id', Number(id))
    .first();
}

function insert(post) {
  return db('posts')
    .insert(post)
      // .then(ids => {
        // console.log(`postDb: insert -> ids`, ids);
      .then(id => {
        console.log(`postDb: insert -> id`, id);
        // return getById(ids[0]);
        // return getById({ id: Number(ids[0]) });
        return getById(id);
      });
}

function update(id, changes) {
  return db('posts')
    .where({ id: Number(id) })
    .update(changes);
}

function remove(id) {
  return db('posts')
    .where('id', Number(id))
    .del();
}
