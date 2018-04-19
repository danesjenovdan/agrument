exports.up = (knex, Promise) => (
  Promise.all([
    knex.schema.alterTable('posts', (table) => {
      table.string('tweet').notNullable().defaultTo('');
      table.string('fbtext').notNullable().defaultTo('');
    }),
  ])
);

exports.down = (knex, Promise) => (
  Promise.all([
    knex.schema.alterTable('posts', (table) => {
      table.dropColumn('tweet');
      table.dropColumn('fbtext');
    }),
  ])
);
