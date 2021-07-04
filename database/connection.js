var knex = require('knex')({
    client: 'mysql2',
    connection: {
      host : '127.0.0.1',
      user : 'root',
      password : 'Celso_bixa2014',
      database : 'user_api'
    }
});

module.exports = knex