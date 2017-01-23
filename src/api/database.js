import knex from 'knex';

const db = knex({
  client: 'sqlite3',
  // client: 'mysql',
  connection: {
    // host: 'localhost',
    // user: 'root',
    // password: '',
    // database: 'djnd',
    filename: './mydb.sqlite',
    timezone: 'Z',
    charset: 'utf8',
  },
});

export default db;
