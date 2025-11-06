import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import '@dotenvx/dotenvx/config';
import { MarketplaceNode } from '../modules/blockchain-marketplace/marketplace-node';
import { MarketPlaceNodeInterface } from '../interfaces/marketplace-node.interface';
import { Blockchain } from '../modules/blockchain-marketplace/blockchain';

let marketplaceNode: MarketplaceNode;

function initializeNode() {
  const URL = `http://localhost:${process.env.PORT}`;
  const initialPeers = ['http://localhost:3000'];
  const blockchain = new Blockchain();
  marketplaceNode = new MarketplaceNode(URL, initialPeers, blockchain);
}

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
}
