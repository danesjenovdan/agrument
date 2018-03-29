/* eslint-disable consistent-return */
exports.up = (knex, Promise) => (
  Promise.all([
    knex.schema.hasTable('users').then((exists) => {
      if (!exists) {
        return knex.schema.createTable('users', (table) => {
          table.increments();
          table.string('name');
          table.string('username').unique().notNullable();
          table.string('password').notNullable();
          table.string('group').notNullable().defaultTo('user');
          table.string('token');
        });
      }
    }),
    knex.schema.hasTable('posts').then((exists) => {
      if (!exists) {
        return knex.schema.createTable('posts', (table) => {
          table.increments();
          table.integer('date').notNullable();
          table.integer('author').notNullable();
          table.string('title').notNullable();
          table.string('content').notNullable();
          table.string('description').notNullable();
          table.string('imageURL').notNullable();
          table.string('imageCaption').notNullable();
          table.integer('hasEmbed').notNullable().defaultTo(0);
          table.string('embedCode');
          table.string('embedHeight');
          table.integer('deadline').notNullable();
          table.string('rights').notNullable();
          table.string('type').notNullable().defaultTo('pending');
          table.string('imageCaptionURL').notNullable();
        });
      }
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
    knex.schema.hasTable('votes').then((exists) => {
      if (!exists) {
        return knex.schema.createTable('votes', (table) => {
          table.increments();
          table.integer('author').notNullable();
          table.integer('post').notNullable();
          table.string('vote').notNullable();
        });
      }
    }),
  ])
);

exports.down = (knex, Promise) => (
  Promise.all([
    knex.schema.dropTable('users'),
    knex.schema.dropTable('posts'),
    knex.schema.dropTable('pinned'),
    knex.schema.dropTable('votes'),
  ])
);
