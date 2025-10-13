import { DataTypes, Model } from 'sequelize';
import { db } from '../db/database.config';

export class Lead extends Model {
  declare email: string;
  declare verified: boolean;
  declare last_campaign: string;
  declare campaignKey: string;
  declare subscribe_to_emails: boolean;
  declare last_clicked_campaign: string;
}

Lead.init(
  {
    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    last_campaign: {
      type: DataTypes.STRING,
    },
    subscribe_to_emails: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    last_clicked_campaign: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize: db,
    modelName: 'Lead',
    tableName: 'leads',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
);

Lead.sync({ alter: true });
