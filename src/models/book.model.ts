import { DataTypes, Model } from 'sequelize';
import { db } from '../db/database.config';

export class Book extends Model {
  declare id: number;
  declare title: string;
  declare author: string;
  declare count: number;
}

Book.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
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
  {
    sequelize: db,
    modelName: 'Book',
    tableName: 'books',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
);

Book.sync();
