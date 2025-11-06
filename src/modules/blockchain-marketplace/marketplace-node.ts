import axios from 'axios';
import { Blockchain } from './blockchain';

export class MarketplaceNode {
  url: string;
  peers: string[];
  blockchain: any;
  balance: number;
  songs: object;

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
}
