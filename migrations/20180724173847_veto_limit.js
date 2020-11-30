/* eslint-disable consistent-return */
exports.up = (knex) => (
  Promise.all([
    knex.schema.alterTable('users', (table) => {
      table.integer('lastVetoVote').notNullable().defaultTo(0);
    }),
  ])
);

exports.down = (knex) => (
  Promise.all([
    knex.schema.alterTable('users', (table) => {
      table.dropColumn('lastVetoVote');
    }),
  ])
);
