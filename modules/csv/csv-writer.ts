import { createObjectCsvWriter } from 'csv-writer';
import prompt from 'prompt'

prompt.start();
prompt.message = '';

const csvWriter = createObjectCsvWriter({
  path: './csv-contacts.csv',
  append: true,
  header: [
    { id: 'name', title: 'NAME' },
    { id: 'number', title: 'NUMBER' },
    { id: 'email', title: 'EMAIL' },
  ]
});

class Person {
  protected name: string;
  protected number: string;
  protected email: string;

  constructor(name: string = '', number: string = '', email: string = '') {
    this.name = name;
    this.number = number;
    this.email = email;
  }

  async saveToCSV() {
    try {
      const { name, number, email } = this;

      await csvWriter.writeRecords([{ name, number, email }]);
      console.log(`${name} Saved!`)
    } catch (error) {
      console.error('Error saving contact:', error);
    }
  }
}

const startApp = async () => {


  const questions = [
    { name: 'name', description: 'Contact Name' },
    { name: 'number', description: 'Contact Number'},
    { name: 'email', description: 'Contact Email' }
  ];

  const responses = await prompt.get(questions);

  
  const person = new Person(responses.name?.toString(), responses.number?.toString(), responses.email?.toString());
  await person.saveToCSV();

  const { again } = await prompt.get([{ name: 'again', description: 'Continue? [y to continue]' }])

  if (again?.toString().toLowerCase() === 'y') await startApp();

}

startApp();

