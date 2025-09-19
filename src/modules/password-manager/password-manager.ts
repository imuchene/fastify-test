import bcrypt from 'bcrypt';
import promptModule, { Prompt } from 'prompt-sync';

interface MockDB {
  passwords: any;
  hash: string;
}

export class PasswordManager {
  prompt: Prompt = promptModule();
  mockDb: MockDB = {
    passwords: {},
    hash: '',
  };

  constructor(){
    if (!this.mockDb.hash) this.promptNewPassword();
    else this.promptOldPassword()
  }

  saveNewPassword(password: string) {
    this.mockDb.hash = bcrypt.hashSync(password, 10);
    console.log('Password has been saved');
    this.showMenu();
  }

  async compareHashedPassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.mockDb.hash);
  }

  promptNewPassword() {
    const response = this.prompt('Enter a main password: ');
    return this.saveNewPassword(response);
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
        this.viewPasswords();
        break;

      case '2':
        this.promptManageNewPassword();
        break;

      case '3':
        this.promptOldPassword();
        break;

      case '4':
        break;

      default:
        console.log(`That's an invalid response`);
        break;
    }
  }

  viewPasswords() {
    const { passwords } = this.mockDb;
    Object.entries(passwords).forEach(([key, value], index) => { console.log(`${index + 1 }. ${key} => ${value}`)});
    this.showMenu()
  }

  promptManageNewPassword() {
    const source = this.prompt('Enter name for password: ');
    const password = this.prompt('Enter password to save: ');

    this.mockDb.passwords[source] = password;
    console.log(`Password for ${source} has been saved!`);
    this.showMenu();
  }

}

new PasswordManager();
