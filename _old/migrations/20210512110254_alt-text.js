exports.up = (knex) => (
  Promise.all([
    knex.schema.alterTable('posts', (table) => {
      table.string('imageAltText').notNullable().defaultTo('');
    }),
  ])
);

exports.down = (knex) => (
  Promise.all([
    knex.schema.alterTable('posts', (table) => {
      table.dropColumn('imageAltText');
    }),
  ])
);
