import SpellChecker from 'spellchecker';
import prompt from 'prompt';
import Sentiment from 'sentiment';
import { SentimentScore } from '../../models/sentiment-score.model';
import * as asciichart from 'asciichart';
import { PlotConfig } from 'asciichart';

prompt.start({});
prompt.message = '';

const chartConfig: PlotConfig = {
  min: -1,
  max: 1,
  height: 10,
};

export class SentimentJournal {
  sentiment: Sentiment;
  scores: number[];
  entry: string;

  constructor() {
    this.sentiment = new Sentiment();
    this.scores = [0];
    this.entry = '';
  }

  correctSpelling(inputString: string) {
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

  async saveScore(score: number) {
    await SentimentScore.create({ score });
  }

  async fetchEntries() {
    const results = await SentimentScore.findAll({ limit: 100 });
    if (results.length) {
      this.scores = results.map(({ score }) => score);
    }
  }

  async analyzeSentiment() {
    if (!this.entry || this.entry === '') return;
    const { score } = this.sentiment.analyze(this.entry);
    const normalizedScore = Math.min(Math.max(score / 10, -1), 1);
    await this.saveScore(normalizedScore);
    this.scores.push(normalizedScore);
  }

  async promptEntry() {
    const { response } = await prompt.get([
      {
        name: 'response',
        description: 'How do you feel?',
      },
    ]);

    this.entry = this.correctSpelling(String(response));
  }

  setChartColor() {
    if (!this.scores.length) return;
    const recentScore = this.scores[this.scores.length - 1];
    if (recentScore && recentScore < 0) {
      chartConfig.colors = [asciichart.red];
    } else {
      chartConfig.colors = [asciichart.green];
    }
  }

  printChart() {
    console.clear();
    this.setChartColor();
    console.log(asciichart.plot([this.scores], chartConfig));
  }
}

async function main() {
  const journal = new SentimentJournal();
  await journal.fetchEntries();

  while (true) {
    journal.printChart();
    await journal.promptEntry();
    await journal.analyzeSentiment();
  }
}

main();
