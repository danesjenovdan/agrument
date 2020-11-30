exports.up = (knex) => (
  Promise.all([
    knex.schema.alterTable('posts', (table) => {
      table.string('emailTemplate').notNullable().defaultTo('normal');
    }),
  ])
);

exports.down = (knex) => (
  Promise.all([
    knex.schema.alterTable('posts', (table) => {
      table.dropColumn('emailTemplate');
    }),
  ])
);
