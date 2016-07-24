import pgp from 'pg-promise';

function sql(name) {
  return new pgp.QueryFile(`${__dirname}/${name}.sql`, { compress: true });
}

export default {
  up: async (db) => db.none(sql('up')),
  down: async (db) => db.none(sql('down')),
};
