import { DataTypes, Model } from 'sequelize';
import { db } from '../db/database.config';

export class LearningProfile extends Model {
  declare id: number;
  declare user_id: string;
  declare password: string;
  declare learning_profile: string;
}

LearningProfile.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.TEXT,
      unique: true,
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    learning_profile: {
      type: DataTypes.TEXT,
      defaultValue: 'This user has no learning profile yet',
    },
  },
  {
    sequelize: db,
    modelName: 'LearningProfile',
    tableName: 'learning_profiles',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
);

LearningProfile.sync();
