import bcrypt from 'bcrypt';
import promptModule, { Prompt } from 'prompt-sync';
import { Collection, Document, MongoClient } from 'mongodb';
import '@dotenvx/dotenvx/config';

export class PasswordManager {
  prompt: Prompt = promptModule();

  dbUrl = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/?authSource=admin&authMechanism=DEFAULT`;
  client: MongoClient = new MongoClient(this.dbUrl);
  hasPasswords = false;
  passwordsCollection: Collection<Document>;
  authCollection: Collection<Document>;
  dbName = String(process.env.MONGO_DATABASE);

  constructor() {
    this.main();
  }

  async main() {
    await this.initializeMongoDb();
    if (!this.hasPasswords) this.promptNewPassword();
    else this.promptOldPassword();
  }

  async initializeMongoDb(): Promise<void> {
    try {
      await this.client.connect();
      console.log('Connected successfully to server');
      const db = this.client.db(this.dbName);
      this.authCollection = db.collection('auth');
      this.passwordsCollection = db.collection('passwords');
      const hashedPassword = await this.authCollection.findOne({
        type: 'auth',
      });
      this.hasPasswords = !!hashedPassword;
    } catch (error) {
      console.error('Error connecting to the database:', error);
      process.exit(1);
    }
  }

  async saveNewPassword(password: string): Promise<void> {
    const hash = bcrypt.hashSync(password, 10);
    await this.authCollection.insertOne({ type: 'auth', hash });
    console.log('Password has been saved');
    this.showMenu();
  }

  async compareHashedPassword(password: string): Promise<boolean> {
    const result = await this.authCollection.findOne({ type: 'auth' });
    if (result) {
      return await bcrypt.compare(password, result.hash);
    }
    return new Promise(() => false);
  }

  async promptNewPassword() {
    const response = this.prompt('Enter a main password: ');
    return await this.saveNewPassword(response);
  }

  async promptOldPassword(): Promise<void> {
    let verified = false;
    while (!verified) {
      const response = this.prompt('Enter your password: ');
      const result = await this.compareHashedPassword(response);

      if (result) {
        console.log('Password verified');
        verified = true;
        this.showMenu();
      } else {
        console.log('Password incorrect. Try again');
      }
    }
  }

  async showMenu(): Promise<void> {
    console.log(`
      1. View passwords
      2. Manage new password
      3. Verify password
      4. Exit
      `);
    const response = this.prompt('>');

    switch (response) {
      case '1':
        await this.viewPasswords();
        break;

      case '2':
        await this.promptManageNewPassword();
        break;

      case '3':
        await this.promptOldPassword();
        break;

      case '4':
        process.exit();

      default:
        console.log(`That's an invalid response`);
        await this.showMenu();
    }
  }

  async viewPasswords() {
    const passwords = await this.passwordsCollection.find({}).toArray();
    passwords.forEach(({ source, password }, index) => {
      console.log(`${index + 1}. ${source} => ${password}`);
    });
    this.showMenu();
  }

  async promptManageNewPassword() {
    const source = this.prompt('Enter name for password: ');
    const password = this.prompt('Enter password to save: ');

    await this.passwordsCollection.findOneAndUpdate(
      { source },
      { $set: { password } },
      { returnDocument: 'after', upsert: true },
    );
    console.log(`Password for ${source} has been saved!`);
    this.showMenu();
  }
}

new PasswordManager();
