const express = require('express');
const { ApolloServer } = require('apollo-server-express');

let aboutMessage = "Issue Tracker API v1.0";

const typeDefs = `
    type Query {
        about: String!
  }
    type Mutation {
        setAboutMessage(message: String!): String
  }
`;

const resolvers = {
    Query: {
        about: () => aboutMessage,
    },
    Mutation: {
        setAboutMessage,
    },
  };

function setAboutMessage(_, { message }) {
    return aboutMessage = message;
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

// Creates & initializes an express application.
const app = express();

//express.static()creates a middleware function
//app.use() method mounts the middleware function
app.use(express.static('public'));

// Installs the Apollo Server as a middleare in Express
// server.applyMiddleware({ app, path: '/graphql' });
server.applyMiddleware({ app, path: '/graphql' });

// listen() method starts server and has it serve HTTP requests.
// starts teh server and waits eternally for requests.
app.listen(3000, function() {
    console.log("App started on port 3000");
});
