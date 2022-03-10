import knex from 'knex';

const db = knex({
  client: 'sqlite3',
  connection: {
    filename: './db.sqlite3',
    timezone: 'Z',
    charset: 'utf8',
  },
  useNullAsDefault: true,
});

export default db;
