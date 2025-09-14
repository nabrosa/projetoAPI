const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const jwt = require('jsonwebtoken');

const SECRET = 'supersecret';

const app = express();

const getUserFromToken = (req) => {
  const auth = req.headers.authorization || '';
  if (auth.startsWith('Bearer ')) {
    const token = auth.replace('Bearer ', '');
    try {
      return jwt.verify(token, SECRET);
    } catch (e) {
      return null;
    }
  }
  return null;
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ user: getUserFromToken(req) })
});

async function startApollo() {
  await server.start();
  server.applyMiddleware({ app });
}

startApollo();

module.exports = app;
