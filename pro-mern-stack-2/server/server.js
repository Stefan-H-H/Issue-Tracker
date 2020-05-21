const fs = require('fs');
const express = require('express');
const { ApolloServer, UserInputError } = require('apollo-server-express');
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language')


let aboutMessage = "Issue Tracker API v1.0";

const GraphQLDate = new GraphQLScalarType({
    name: 'GraphQLDate',
    description: 'A Date() type in GraphQL as a scalar',
    serialize(value) {
        return value.toISOString();
    },
    parseValue(value) {
        const dateValue = new Date(value);
        return isNaN(dateValue) ? undefined : dateValue
    },
    parseLiteral(ast) {
        if (ast.kind == Kind.STRING) {
            const value = new Date(ast.value);
            return isNaN(value) ? undefined : value
        }
    },
});

const issuesDB = [
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
        issueAdd,
    },
    GraphQLDate,
  };

function setAboutMessage(_, { message }) {
    return aboutMessage = message;
}

function issueList() {
    return issuesDB;
}

function issueValidate(issue) {
    const errors = [];
    if (issue.title.length < 3) {
        errors.push('Field "title" must be at least 3 characters long.');
    }
    if (issue.status == 'Assigned' && !issue.owner) {
        errors.push('Field "owner" is required when status is "Assigned');
    }
    if (errors.length > 0) {
        throw new UserInputError('Invalid input(s)', errors);
    }
}

function issueAdd(_, {issue}) {
    issueValidate(issue);
    issue.created = new Date();
    issue.id = issuesDB.length + 1;
    issuesDB.push(issue);
    return issue
}


const server = new ApolloServer({
    typeDefs: fs.readFileSync('./server/schema.graphql', 'utf-8'),
    resolvers,
    formatError: error => {
        console.error(error);
        return error;
    }
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
