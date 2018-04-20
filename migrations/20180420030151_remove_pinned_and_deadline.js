/* eslint-disable consistent-return */
exports.up = (knex, Promise) => (
  Promise.all([
    knex.schema.alterTable('posts', (table) => {
      table.dropColumn('deadline');
    }),
    knex.schema.dropTable('pinned'),
  ])
);

exports.down = (knex, Promise) => (
  Promise.all([
    knex.schema.alterTable('posts', (table) => {
      table.integer('deadline').notNullable();
    }),
    knex.schema.hasTable('pinned').then((exists) => {
      if (!exists) {
        return knex.schema.createTable('pinned', (table) => {
          table.increments();
          table.integer('author').notNullable();
          table.integer('timestamp').notNullable();
          table.string('message').notNullable();
        });
      }
    }),
  ])
);
