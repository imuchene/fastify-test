import { appendFileSync } from 'fs';
import { createInterface } from 'readline';

const readLine = createInterface({
  input: process.stdin,
  output: process.stdout,
});

const readLineAsync = (message: string) =>
  new Promise<string>((resolve) => readLine.question(message, resolve));

class Person {
  protected name: string;
  protected number: string;
  protected email: string;

  constructor(name = '', number = '', email = '') {
    this.name = name;
    this.number = number;
    this.email = email;
  }

  saveToCSV() {
    const content = `${this.name}. ${this.number},${this.email}\n`;
    try {
      appendFileSync('./contacts.csv', content);
      console.log(`${this.name} Saved!`);
    } catch (error) {
      console.error(error);
    }
  }
}

const startApp = async () => {
  {
    let shouldContinue = true;
    while (shouldContinue) {
      const name = await readLineAsync('Contact Name: ');
      const number = await readLineAsync('Contact Number: ');
      const email = await readLineAsync('Contact Email: ');

      const person = new Person(name, number, email);
      person.saveToCSV();

      const response = await readLineAsync('Continue? [y to continue]: ');
      shouldContinue = response.toLowerCase() === 'y';
    }

    readLine.close();
  }
};

startApp();
