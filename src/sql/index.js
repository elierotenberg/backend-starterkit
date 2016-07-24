import pgp from 'pg-promise';

function sql(name) {
  return new pgp.QueryFile(`${__dirname}/${name}.sql`, { compress: true });
}

export const selectCurrentTimestamp = sql('selectCurrentTimestamp');
