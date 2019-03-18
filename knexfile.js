module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/palette_picker',
    useNullAsDefault: true,
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds/development'
    }
  },
};
