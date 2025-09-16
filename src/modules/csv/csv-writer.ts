import { createObjectCsvWriter } from 'csv-writer';
import prompt, { Schema } from 'prompt';

prompt.start();
prompt.message = '';

const csvWriter = createObjectCsvWriter({
  path: './csv-contacts.csv',
  append: true,
  header: [
    { id: 'name', title: 'NAME' },
    { id: 'number', title: 'NUMBER' },
    { id: 'email', title: 'EMAIL' },
    { id: 'createdAt', title: 'CREATED AT' },
  ],
});

class Person {
  protected name: string;
  protected number: string;
  protected email: string;
  protected createdAt: string;

  constructor(name = '', number = '', email = '') {
    this.name = name;
    this.number = number;
    this.email = email;
    this.createdAt = new Date().toISOString();
  }

  async saveToCSV() {
    try {
      const { name, number, email, createdAt } = this;

      await csvWriter.writeRecords([{ name, number, email, createdAt }]);
      console.log(`${name} Saved!`);
    } catch (error) {
      console.error('Error saving contact:', error);
    }
  }
}

const startApp = async () => {
  const questions: Schema = {
    properties: {
      name: {
        type: 'string',
        required: true,
        description: 'Contact Name',
      },
      number: {
        type: 'string',
        pattern: /^\d+$/,
        required: true,
        description: 'Contact Number',
      },
      email: {
        type: 'string',
        pattern: /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/,
        required: true,
        description: 'Contact Email',
      },
    },
  };

  const responses = await prompt.get(questions);

  const person = new Person(
    responses.name?.toString(),
    responses.number?.toString(),
    responses.email?.toString(),
  );
  await person.saveToCSV();

  const { again } = await prompt.get([
    { name: 'again', description: 'Continue? [y to continue]' },
  ]);

  if (again?.toString().toLowerCase() === 'y') await startApp();
};

startApp();
