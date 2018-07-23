# Agrument (using React)

### Install (with node 8)
```
$ npm install
$ npm run migrate
```

### Create admin user
```
$ knex seed:run
# or
$ node_modules/.bin/knex seed:run
```

## Development

First start the api the server (on port `8080`):

```
$ npm run api
```

Then start a dev server with:

```
$ npm start
```

This will start a webpack-dev-server on `localhost:3000` and proxy all `/api` requests to `localhost:8080`


## Deploy (using `pm2`)

To deploy, first setup the `ecosystem.config.js` and make sure `pm2` is installed on remote machine.

Then run to setup the deployment on the remote server.

```
$ npm run deploy:setup
```

Then every time you want to update the deployed version push all changes and run:
```
$ npm run deploy
```
