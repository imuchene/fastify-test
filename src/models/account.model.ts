import { DataTypes, Model } from 'sequelize';
import { db } from '../db/database.config';
import crypto from 'node:crypto';
import { Strategy as LocalStrategy, VerifyFunction } from 'passport-local';

export class Account extends Model {
  declare username: string;
  declare hash: string;
  declare password: string;
  declare confirmPassword: string;
  declare salt: string;

  static async findByUsername(username: string): Promise<Account | null> {
    const lowerCaseUsername = username.toLowerCase();
    return await this.findOne({ where: { username: lowerCaseUsername } });
  }

  static async register(username: string, password: string): Promise<Account> {
    const existingAccount = await this.findByUsername(username);
    if (existingAccount) {
      throw new Error('Account already exists');
    }
    const account = this.build({ username });
    account.setPassword(password);
    return await account.save();
  }

  setPassword(password: string): void {
    if (!password) {
      throw new Error('No password supplied');
    }

    try {
      const bufferBytes = crypto.randomBytes(32);
      const salt = bufferBytes.toString('hex');
      const hashRaw = crypto.pbkdf2Sync(password, salt, 12000, 64, 'sha512');
      this.set('hash', Buffer.from(hashRaw).toString('hex'));
      this.set('salt', salt);
    } catch (error) {
      if (error && error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error('Unable to hash password');
      }
    }
  }

  authenticate(password: string): boolean {
    const { salt, hash } = this;
    if (!salt) {
      throw new Error('No salt found');
    }

    const hashRaw = crypto.pbkdf2Sync(password, salt, 12000, 64, 'sha512');
    const currentHash = Buffer.from(hashRaw).toString('hex');
    return currentHash === hash;
  }

  static passportAuthenticate(): VerifyFunction {
    return async (
      username: string,
      password: string,
      done: CallableFunction,
    ) => {
      try {
        const account = await this.findByUsername(username);

        if (!account) {
          return done(null, false, { message: 'User not found ' });
        }

        const isValid = account.authenticate(password);
        if (isValid) {
          return done(null, account);
        } else {
          return done(null, false, { message: 'Password incorrect' });
        }
      } catch (error) {
        return done(error);
      }
    };
  }

  static serializeUser(account: Account, done: CallableFunction) {
    const { username } = account;
    done(null, username);
  }

  static async deserializeUser(username: string, done: CallableFunction) {
    try {
      const foundAccount = await this.findByUsername(username);

      if (!foundAccount) {
        return done(new Error('User not found'));
      }
    } catch (error) {
      done(error);
    }
  }

  static genStrategy() {
    return new LocalStrategy(this.passportAuthenticate());
  }
}

Account.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    salt: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: 'Account',
    tableName: 'accounts',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
);

Account.beforeCreate((account) => {
  account.username = account.username.toLowerCase();
});

Account.sync({ alter: true });
