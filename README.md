# danesjenovdan.si
Koda, ki poganja DJND domek.

-----

## Rewrite using React Router Dynamic Route Loading w/ Webpack 2 Chunks

### Install (node 8)
```
$ npm install
$ npm i -g knex
$ knex migrate:latest
$ knex seed:run
```

### Dev Server

To start a dev server on `localhost:3000` and proxy all `/api` requests to `localhost:8080` run:

```
$ npm start
```

To start the server on `localhost:8080`.

```
$ npm run api
```

### Production

This will build and run a (pages and api) server on `localhost:80`:

```
$ npm run build-serve
```
