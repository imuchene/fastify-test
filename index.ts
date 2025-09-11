import fastify from 'fastify';

const server = fastify();

server.get('/ping', async (request, reply) => {
  return 'pong \n';
});

server.listen({ port: 8080}, (error, address) => {
  if (error) {
    console.error(error);
    process.exit(1)
  }

  console.log(`Server listening at ${address}`)
})