import SpellChecker from 'spellchecker';

const inputString: string = 'I am feling grat!';

const correcSpelling = (inputString: string ) => {
  const words = inputString.split(' ');
  const corrections = [];

  for (const word of words) {
    if (SpellChecker.isMisspelled(word)) {
      const options = SpellChecker.getCorrectionsForMisspelling(word);
      corrections.push(options[1])
    }
    else {
      corrections.push(word);
    }
  }

  return corrections.join(' ');
}

console.log(correcSpelling(inputString));

