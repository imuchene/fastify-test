import SpellChecker from 'spellchecker';
import natural, { PorterStemmer, SentimentAnalyzer } from 'natural';
import prompt from 'prompt';

prompt.start({});
prompt.message = '';

const tokenizer = new natural.WordTokenizer();

function correctSpelling(inputString: string) {
  const words = inputString.split(' ');
  const corrections = [];

  for (const word of words) {
    if (SpellChecker.isMisspelled(word)) {
      const options = SpellChecker.getCorrectionsForMisspelling(word);
      corrections.push(options[0]);
    } else {
      corrections.push(word);
    }
  }

  return corrections.join(' ');
}

function tokenizeInput(inputString: string) {
  return tokenizer.tokenize(inputString);
}

async function main() {
  try {
    const { inputString } = await prompt.get([
      {
        name: 'inputString',
        description: 'How do you feel?',
      },
    ]);

    const analyzer = new SentimentAnalyzer('English', PorterStemmer, 'afinn');
    const correctedSpelling = correctSpelling(String(inputString));
    const tokens = tokenizeInput(correctedSpelling);
    const sentimentResults = analyzer.getSentiment(tokens);

    console.log('sentiment results', sentimentResults);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('An error occurred: ', error.message);
    }
  }
}

main();
