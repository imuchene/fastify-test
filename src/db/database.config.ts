import path from 'path';
import { Sequelize } from 'sequelize';

export const db = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'database.sqlite'),
});

try {
  db.authenticate();
  console.log('Connection has been established successfully');
} catch (error) {
  console.error('Unable to connect to the database: ', error);
}
