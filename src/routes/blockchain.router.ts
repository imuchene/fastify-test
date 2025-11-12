import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import '@dotenvx/dotenvx/config';
import { MarketplaceNode } from '../modules/blockchain-marketplace/marketplace-node';
import { MarketPlaceNodeInterface } from '../interfaces/marketplace-node.interface';
import { Blockchain } from '../modules/blockchain-marketplace/blockchain';
import { Transaction } from '../interfaces/transaction';
import { TransactionTypes } from '../enums/transaction-types.enum';

let marketplaceNode: MarketplaceNode;

function initializeNode() {
  const URL = `http://localhost:${process.env.PORT}`;
  const initialPeers = ['http://localhost:3000'];
  const blockchain = new Blockchain();
  marketplaceNode = new MarketplaceNode(URL, initialPeers, blockchain);
}

initializeNode();

export async function blockchainRoutes(fastify: FastifyInstance) {
  fastify.post(
    '/register_node',
    async (
      request: FastifyRequest<{ Body: MarketPlaceNodeInterface }>,
      reply: FastifyReply,
    ) => {
      const { url: newNodeUrl } = request.body;
      await marketplaceNode.registerNode(newNodeUrl);
      reply.send({ message: 'Node Registered' });
    },
  );

  fastify.post(
    '/sync_peers',
    async (
      request: FastifyRequest<{ Body: MarketPlaceNodeInterface }>,
      reply: FastifyReply,
    ) => {
      const { peers } = request.body;
      marketplaceNode.peers = peers;
      console.log(`${marketplaceNode.url} synced ${marketplaceNode.peers}`);
      reply.send({ message: 'Synced peers' });
    },
  );

  fastify.post(
    '/sync_blockchain',
    async (
      request: FastifyRequest<{ Body: MarketPlaceNodeInterface }>,
      reply: FastifyReply,
    ) => {
      const { chain } = request.body;
      marketplaceNode.blockchain = new Blockchain(
        chain,
        marketplaceNode.blockchain.pendingTransactions,
      );
      console.log(`Syncing blocks ${JSON.stringify(chain)}`);
      reply.send({ message: 'Blockchain synced', blockCount: chain.length });
    },
  );

  fastify.post(
    '/payment',
    async (
      request: FastifyRequest<{ Body: MarketPlaceNodeInterface }>,
      reply: FastifyReply,
    ) => {
      const { price } = request.body;
      marketplaceNode.balance += price;
      reply.send({ message: `New balance ${marketplaceNode.balance}` });
    },
  );

  fastify.post(
    '/sell',
    async (
      request: FastifyRequest<{ Body: Transaction }>,
      reply: FastifyReply,
    ) => {
      const { price, songTitle } = request.body;
      await marketplaceNode.processTransaction({
        price,
        songTitle,
        sender: marketplaceNode.url,
        transactionType: TransactionTypes.Sell,
        id: '',
        recipient: '',
        expiration: '',
      });

      reply.send({ message: 'Song being listed' });
    },
  );

  fastify.post(
    '/buy',
    async (
      request: FastifyRequest<{ Body: Transaction }>,
      reply: FastifyReply,
    ) => {
      const { id } = request.body;
      const transaction = marketplaceNode.songs[id];

      if (!transaction) {
        return reply.send({ message: 'No song exists by that id' });
      }

      const result = await marketplaceNode.processTransaction({
        id: transaction.id,
        price: transaction.price,
        songTitle: transaction.songTitle,
        expiration: transaction.expiration,
        recipient: transaction.sender,
        sender: marketplaceNode.url,
        transactionType: TransactionTypes.Buy,
      });

      reply.send({ message: result });
    },
  );

  fastify.get(
    '/songs',
    async (request: FastifyRequest, reply: FastifyReply) => {
      reply.send({ songs: marketplaceNode.availableSongs() });
    },
  );
}
