import { Sequelize } from 'sequelize';

const db = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
});

try {
  db.authenticate();
  console.log('Connection has beeb established successfully');
} catch (error) {
  console.error('Unable to connect to the database: ', error);
}

export default { Sequelize, db };
