import { createHash } from 'crypto';

export class Block {
  transactions: any[];
  previousHash: string | null;
  timestamp: number;
  hash: string;
  nextHash: string | null;

  constructor(transactions: any[], previousHash: string | null) {
    this.timestamp = Date.now();
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nextHash = null;
  }

  calculateHash(): string {
    return createHash('sha256')
      .update(
        String(this.previousHash) +
          this.timestamp +
          JSON.stringify(this.transactions),
      )
      .digest('hex');
  }
}
