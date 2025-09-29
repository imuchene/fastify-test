import { DataTypes } from 'sequelize';
import { db } from '../db/database.config';

export const Book = db.define(
  'Book',
  {
    title: {
      type: DataTypes.STRING,
      unique: true,
    },
    author: {
      type: DataTypes.STRING,
    },
    count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  { tableName: 'books', timestamps: true },
);

db.sync();
