exports.seed = (knex) => (
  knex('users')
    .insert({
      id: 1,
      username: 'admin',
      name: '',
      password: '',
      group: 'admin',
      token: '12345678',
    })
    .then(() => {
      console.log('---------------------------------------------------------------------------'); // eslint-disable-line no-console
      console.log('Go to: /register?id=1&token=12345678 to generate a password for admin user!'); // eslint-disable-line no-console
      console.log('---------------------------------------------------------------------------'); // eslint-disable-line no-console
    })
);
