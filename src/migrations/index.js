import fs from 'fs';
Promise.promisifyAll(fs);
import ncp from 'ncp';
Promise.promisifyAll(ncp);

export async function createMigration(from, to) {
  return await ncp.ncpAsync(`${__dirname}/template`, `${__dirname}/from-${from}-to-${to}`);
}

export async function migrate(db, from, to, action) {
  const migrations = [];
  await Promise.map(await fs.readdirAsync(__dirname), async (file) => {
    if((await fs.statAsync(`${__dirname}/${file}`)).isDirectory()) {
      migrations.push(file);
    }
  });
  const migration = migrations.find((file) => file === `from-${from}-to-${to}`);
  if(!migration) {
    throw new Error('No such migration');
  }
  const module = require(`./${migration}`); // eslint-disable-line global-require
  console.log(`Migrating from ${from} to ${to}: ${action}`);
  await module[action];
  console.log(`Migration done from ${from} to ${to}: ${action}`);
}
