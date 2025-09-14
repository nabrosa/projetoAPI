const { gql } = require('apollo-server-express');

module.exports = gql`
  type User {
    username: String!
  }

  type AuthPayload {
    token: String!
  }

  type Schedule {
    username: String!
    day: String!
    time: String!
  }

  type Query {
    users: [User!]!
  }

  type Mutation {
    register(username: String!, password: String!): String!
    login(username: String!, password: String!): AuthPayload!
    registerSchedule(day: String!, time: String!): String!
  }
`;
