import { DataTypes, Model } from 'sequelize';
import { db } from '../db/database.config';

export class SentimentScore extends Model {
  declare id: number;
  declare score: number;
}

SentimentScore.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    score: {
      type: DataTypes.DECIMAL,
    },
  },
  {
    sequelize: db,
    modelName: 'SentimentScore',
    tableName: 'sentiment_scores',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
);

SentimentScore.sync();
