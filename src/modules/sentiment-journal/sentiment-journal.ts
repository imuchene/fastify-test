import SpellChecker from 'spellchecker';
import natural from 'natural';
import { removeStopwords } from 'stopword'

const inputString: string = 'I am feeelinng grea!';
const tokenizer = new natural.WordTokenizer()

function correctSpelling(inputString: string ){
  const words = inputString.split(' ');
  const corrections = [];

  for (const word of words) {
    if (SpellChecker.isMisspelled(word)) {
      const options = SpellChecker.getCorrectionsForMisspelling(word);
      corrections.push(options[0])
    }
    else {
      corrections.push(word);
    }
  }

  return corrections.join(' ');
}

function tokenizeInput(inputString: string){
  return tokenizer.tokenize(inputString);
}

function stemWords(tokens:Array<any>) {
  const stems = [];
  for (const token of tokens) {
    const stem = natural.PorterStemmer.stem(token);
    stems.push(stem);
  }

  return stems;
}

const correctedSpelling = (correctSpelling(inputString));
const tokens = tokenizeInput(correctedSpelling);
const stems = stemWords(tokens);
const removedStopwords = removeStopwords(stems);

console.log('tokens', tokens);
console.log('stems', stems);
console.log('removedStopwords', removedStopwords);

