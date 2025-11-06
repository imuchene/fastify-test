import { Block } from './block';

export class Blockchain {
  chain: any[];
  pendingTransactions: any[];
  difficulty: number;
  miningReward: number;

  constructor(chain?: any[], pendingTransactions: any[] = []) {
    this.chain = chain || [this.createGenesisBlock()];
    this.difficulty = 4;
    this.pendingTransactions = pendingTransactions;
    this.miningReward = 100;
  }

  createGenesisBlock() {
    return new Block([], null);
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }
}
