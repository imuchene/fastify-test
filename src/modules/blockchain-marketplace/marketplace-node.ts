import axios from 'axios';
import { Blockchain } from './blockchain';
import { Transaction } from '../../interfaces/transaction';
import { TransactionTypes } from '../../enums/transaction-types.enum';

export class MarketplaceNode {
  url: string;
  peers: string[];
  blockchain: any;
  balance: number;
  songs: any;

  constructor(url: string, peers: string[], blockchain?: Blockchain) {
    this.url = url;
    this.peers = peers;
    this.blockchain = blockchain;
    this.balance = 50000;
    this.songs = {};
    this.broadcastSelf();
  }

  async broadcastSelf() {
    this.broadcast('register-node', { url: this.url });
  }

  async registerNode(newNodeUrl: string) {
    this.peers.push(newNodeUrl);
    await this.broadcast('sync-peers', { peers: this.peers });
    await this.broadcastBlockchain();
  }

  async broadcast(path: string, data: any) {
    await Promise.all(
      this.peers.map(async (peer: string) => {
        if (peer === this.url) return;
        try {
          await axios.post(`${peer}/${path}`, data);
        } catch (error) {
          if (error instanceof Error) {
            console.error('broadcast error', error.message);
          }
        }
      }),
    );
  }

  async broadcastBlockchain() {
    this.broadcast('sync-blockchain', { chain: this.blockchain.chain });
  }

  async processTransaction(transactionHash: Transaction) {
    const transaction = new Transaction(transactionHash);
    const id = transactionHash.id || transaction.id;

    if (transaction.transactionType === TransactionTypes.Buy) {
      if (this.balance < transaction.price) return 'Insufficient balance';

      this.balance -= transaction.price;

      try {
        await axios.post(`${transaction.sender}/payment`, {
          price: transaction.price,
        });
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message);
        }
      }

      console.log({ bal: this.balance });

      this.songs[id] = transaction;
      this.blockchain.pendingTransactions.push(transaction);

      if (this.blockchain.pendingTransactions.length > 4) {
        console.log(await this.mine());
      }

      await this.broadcastBlockchain();
      return 'Processed transaction';
    }
  }

  async mine() {
    const price = this.blockchain.miningReward;

    const reward = new Transaction({
      sender: this.peers[0],
      recipient: this.url,
      price,
      transactionType: TransactionTypes.Mine,
    });

    this.blockchain.pendingTransactions.push(reward);
    await this.blockchain.mineBlock();
    this.balance += price;
    return 'Mining complete';
  }

  availableSongs() {
    // return Object.values(this.songs).filter((transaction: any) => transaction.transactionType === TransactionTypes.Sell).map(({ id, songTitle, price }) => [id, songTitle, price]);
    return Object.values(this.songs).filter(
      (transaction: any) =>
        transaction.transactionType === TransactionTypes.Sell,
    );
  }
}
