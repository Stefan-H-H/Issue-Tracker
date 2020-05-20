const fs = require('fs');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');

let aboutMessage = "Issue Tracker API v1.0";

const issueDB = [
    {
        id: 1, status: "New", owner: "Ravan", effort: 5,
        created: new Date("2018-01-15"), due: undefined,
        title: "Error in console when clicking Add",
    },
    {
        id: 2, status: "Assigned", owner: "Eddie", effort: 14,
        created: new Date("2018-01-16"), due: new Date("2018-02-01"),
        title: "Missing bottom border on panel",
    }
];

const resolvers = {
    Query: {
        about: () => aboutMessage,
        issueList,
    },
    Mutation: {
        setAboutMessage,
    },
  };

function setAboutMessage(_, { message }) {
    return aboutMessage = message;
}

function issueList() {
    return issueDB;
}


const server = new ApolloServer({
    typeDefs: fs.readFileSync('./server/schema.graphql', 'utf-8'),
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
