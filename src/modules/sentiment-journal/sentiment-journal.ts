import SpellChecker from 'spellchecker';
import natural, { PorterStemmer, SentimentAnalyzer } from 'natural';

const inputString = 'I am feeelinng bad!';
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

const analyzer = new SentimentAnalyzer('English', PorterStemmer, 'afinn');

const correctedSpelling = correctSpelling(inputString);
const tokens = tokenizeInput(correctedSpelling);
const sentimentResults = analyzer.getSentiment(tokens);

console.log('tokens', tokens);
console.log('sentiment results', sentimentResults);
