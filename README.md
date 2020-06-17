# StefanHristov-Book  
Work through Pro MERN Stack 2nd Ed
---
Work through *Pro MERN Stack* (2nd Ed.)

This is my repository for the project described in the book *Pro MERN Stack* (2nd Ed.) by Vasan Subramanian. Notes included are general notes that I thought would be beneficial for reference. Notes also include any errors or issues encountered while working throughout the book.

---

## Chapter 7
### Summary & Functionality Added:
This chapter is centered around making changes that improve overall scalability of the project and workflow by focusing on changing the overall architecture of the project and implementing the use of ESLint to enforce good and consistent code style. No new application functionality was added in this chapter. That said, we changed the architecture of the project, by splitting the one (1) original server into two (2) -- an API Server, and a separate UI Server, each responsible for their own functions. Additionally, ESLint is used to add checks and for  adhering to coding standards, best practices, and validations.

![ch07](/readme_images/ch7-api.png)
![ch07](/readme_images/ch7-ui.png)

### Chapter 7 Notes:

#### UI Server:
- To date, the Express server was serving static content, but also served API calls.
- In this section, directories and file names were reconfigured such that the two functions previously performed by one server is split out and performed by two servers. One server that serves static content (**UI Server**), and one that hosts just the API (**API Server**).
- For development purposes, we run the UI and API Servers on the same computer, but on different ports. The ports are as follows:
    - API Server: port 3000
    - UI Server: port 8000
- The API server will now be responsible for handling only the API requests and respond only to URLs matching `/graphql` in the path.
- The UI Server will now be responsible for contain the static middleware and serve all static content.
#### Multiple Environments:
- In this section rather than predetermine the ports and MongoDB URL based on possible deployment targets such as development, staging, production, we keep the variables flexible so that they can be set to anything at run time.
- We utilize a `dotenv` package to allow us to set up a configuration `.env` file for both the UI and API Servers. The package allows us to convert variables stored in a configuration file into environment variables. This way, in our code, we only deal with environmental variables, allowing us the flexibility of having the environment variables be supplied via real environment variables or via a configuration file.
- It is recommended that `.env` file not be checked into any repository.
-Note that the actual environment variables take precedence over (or override) the same variable defined in the `.env` file.
#### Proxy-Based Architecture:
- Per the Network tab of the Developer console, we see that two calls to `/graphql` are made instead of one. The reason is that the API call is to a host (`http://localhost:3000)` that is different from the origin of the application (`http://localhost:8000`).
- Due to the same-origin policy, requests like this are normally blocked by the browser unless the server specifically allows it.
- This mechanism is called *cross-origin resource sharing* or **CORS** for short.
- Typically, CORS is disabled to protect against malicious attacks.
- For exploration purposes, we run `npm install http-proxy-middleware@0` in the UI server directory and make a few file changes to the `uiserver.js` and `.env` files. In doing so, we create a proxy such that the UI Server routes uses a proxy to route any requests to `graphql` to the API Server allowing us an alternate way to make API calls.
- For the sake of following the book, proxy changes were reverted so that **direct API call mechanism** can be used.
#### ESLint:
- Here we install and configure ESLint to help our workflow and help us and our code adhere to conventions, standards and good practices. ESLint is a linter that allows us to define rules we want to follow. 
- We extend from the base configuration and rule sets defined by the **Airbnb** style guide/configuration. In the `api` directory, since we are only working on the back-end code only, we only  set up the  base configuration from Airbnb for plain JavaScript.
- We create an `.eslintrc` file (JSON specification) in the `api` directory which acts as a specification for which rules need to be enabled or disabled. By using the .`eslintrc` file, we make the rules apply to all files in the directory. In order to override rules in a single file, rules can be specified within comments in that file.
- We create a script in the `package.json` file so that we  may run `npm run lint` at the command line to run ESLint and check for errors/warnings that will be displayed at the command line.
#### ESLint for the Front-End:
- Here we install and configure ESLint for the `ui` directory like was done for the back-end (`api` directory), but we also include the complete **Airbnb** configuration, which includes the React plugin.
- We exclude the `public` directory from linting because it includes a compiled `App.js` and would result in many errors. The following command is issued to include multiple extensions (`--ext`) and ignore the `public` directory (`--ignore-pattern`):
    - `$ npx eslint . --ext js,jsx --ignore-pattern public`
- We  also create a script in the `package.json` file so that we  may run `npm run lint` at the command line to run ESLint and check for errors/warnings that will be displayed at the command line.
#### React PropTypes:
- Similar to Java which is strongly-typed and provides type validation, the properties being passed from one component to another component can also be validated against a specification.
- The specification can be supplied in the form of a static object called `propTypes` in the class, with the name of the property as the key and the validator as the value.
-  Use case examples and documentation for PropTypes shown here [https://www.npmjs.com/package/prop-types].

### Errors & Issues:
- Upon migrating files to an independent `api` directory as specified on page 175-176 of the textbook,  the API Server would consistently crash and not work properly. As such, the `package.json` file was changed such that the graphql version was changed from `0.13.2` to `14.2.1`. `npm install` was ran again after making the change, and the API server became operational.
- On page 178-181 of the textbook, the author's figures reference the environmental variable configuration file name as `sample.env`. The author's online repository declares the environmental configuration file name as `sample.env`. **This is not correct!** The files should be named simply `.env` in order for `nodemon` to be able to properly watch these configuration files, and properly import and set the defined import variables.


## Chapter 6
### Summary & Functionality Added:
In this chapter we performed a local installation of MongoDB and `mongo` shell to interact with a MongoDB server. The purpose of this chapter is to replace the previous array of issues in the Express server's memory that was previously used as the database, and instead use a MongoDB database to implement read and write functionality to and from the issues list from the MongoDB database.

**A Few Notes for MongoDB & Mongo Shell**:
- To *start* and run MongoDB as a MacOS service, issue the following command at the command line:

`brew services start mongodb-community@4.2`
- To *stop* the `mongod` process running as a macOS service, issue the following command:

`brew services stop mongodb-community@4.2`
- To verify that MongoDB is running, search `mongod` in your running processes at the command line:

`ps aux | grep -v grep | grep mongod`
- To *begin* using MongoDB, connect a mongo shell to the running instance. Issue the following to start the mongo shell:

`mongo`
- To *stop* the mongo shell, a keyboard interrupt `Ctrl+C` can be used.


![ch06](/readme_images/ch6.png)

### Chapter 6 Notes:

#### MongoDB Basics:
- MongoDB is a *document* database, which means that the equivalent of a record is a document, or an object.
- A document is a data structure composed of field and value pairs. The values of fields may include objects, arrays, arrays of objects, etc., as deeply nested as need be.
- MongoDB document has support not only for primitive data type (boolean, numbers, and string), but also for common data types such as dates, timestamps, regular expressions, and binary data.
- A *collection* is like a table in a relational database: it is a set of documents.
- A primary key is mandated in MongoDB, and it has a reserved field name `_id`. If the `_id` field is not supplied when creating a document, MongoDB creates this field and auto-generates a unique key for every document. Most often, the auto-generated ID can be used. MongoDB uses a special data type called the `ObjectId` for the primary key.
- The MongoDB query language is made up of *methods* to achieve various operations. All methods operate on a collection and take parameters as JavaScript objects that specify the details of the operation. For querying, the parameters are a query filter and a list of fields to return - called a **projection**.
- Installed MongoDB on my computer by following instructions posted here: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/
- **Mongo Shell**:
    - The mongo shell is an interactive JavaScript shell, similar to the Node.js shell.
    - mongo shell documentation can be accessed at: https://docs.mongodb.com/manual/mongo
    - `show databases` - a command that will show the current available databases and the storage occupied by them.
    - `db` - a command used to identify the current database in use.
    - `show collections` - a command used to see what collections exist in the database in use.
    - `use <name>` - a command used to switch to a new database called `<name>` instead of the default database.
    - `db.<collection>.insertOne()` - a method to insert a new document in the named `<collection>` . A collection is referenced as a property of the global `db` object. E.g. - The collection called `employees` can be referred to as `db.employees`.
    - `db.<collection>.find()` method when used without any arguments lists all the documents in the collection, but it is not displayed in readable-friendly way. Appending the `.pretty()` method on the end will format the output in a more legible manner. The `find()` method returns a `cursor` object that may be iterated over.
    - While Node.js uses the `console.log()` method for printing objects to the console, the mongo shell uses `print()` for the same purpose, but only prints strings. Objects either need to be converted to strings before printing using `tojson()` or use another method called `printjson()`, which prints objects as JSON.
#### MongoDB CRUD Operations:
- `db.<collection>.drop()` -  a convenient method that a collect object can use to erase itself.
- **Create**:
    - If one attempts to insert a document with an `_id` already in use, a `WriteError` will result  due to a duplicate key.
    - The `_id` field is a primary key and is expected to be unique, regardless of whether it is auto-generated or supplied in the document.
    - It is best to let MongoDB auto-generate the `_id`.
    - The `db.<collection>.insertMany()` method can be used to insert multiple documents in a single command.
- **Read**:
    - the `find()` method two arguments that allows us to retrieve a subset of documents instead of a full list. The first argument is a filter to apply to the list of documents, and the second is a projection ( a specification of which fields to retrieve). The *filter* is an object where the property name is the field to filter on, and the value is the value that it needs to match. e.g. `{id: { $eq: 1} }`. General format of a single element in the filter is `fieldname: { operator: value }`. If multiple fields are specified, then all have to match (equivalent to *and* operation).
    - The `createIndex()` method is used wanting to create an index on a particular field. It takes an argument specifying the fields that form the index. The second argument to `createIndex()` is an object that contains various attributes of the index, one of them specifying whether the index is unique.
- **Projection**:
    - A projection specifies which fields to include or exclude in the result. The format of this specification is an object with one or more field names as the key and the values 0 or 1, to indicate inclusion or exclusion. The `_id` field is an exception, it is always included unless you specify a 0. e.g. `db.employees.find({}, { _id: 0, 'name.first': 1, age: 1})`
- **Update**:
    - There are two methods, `updateOne()` and `updateMany()` typically used for modifying a document. `updateOne()` stops after finding and updating the first matching document.
    - The update specification is an object with a series of `$set` properties whose values indicate another object, which specifies the field and its new value. e.g. `db.employees.updateOne({ id: 2}, { $set: {age: 23 } })`.
    - The `updateMany()` method has the same format as `updateOne()` but the effect is to **all** documents that match will be modified.
    - There is a method called `replaceOne()`, which instead of modifying a document, it replaces the existing document with a new one. The `_id` field is not modified as a result of the replacement.
- **Delete**:
    - `deleteOne()` and `deleteMany()` can be both used to remove document(s) from the collection. The method takes a filter and deletes the matching document.
    - The `count()` method on a collection can tell us how many documents it contains.
- **Aggregate**:
    - The `aggregate()` method can be used to provide a summary or an aggregation based on the documents in a collection.
    - The `aggregate()` method operates as a pipeline. Every stage of the pipeline takes the input from the result of the previous stage and operates per its specification to result in a new modified set of documents.
    - Here's an example of an aggregate that aggregates the total age for different organizations: 
    `> db.employees.aggregate([ 
    {$group: {_id: '$organization', total_age: {$sum: '$age' } } }
    ])`
#### MongoDB Node.js Driver:
- `npm install mongodb@3` was run to install and use a low-level driver. This is the Node.js driver that allows one to connect and interact with the MongoDB Server.
- A file `trymongo.js` was created to play around with different methods and interact with the MongoDB server.
- A URL identifies which database to connect to and the `connect()` method is used to connect make a connection to the database server.
- The `connect()` method is an asynchronous method and needs a call back to receive the result of the connection.
- `client.close()` is a method se to close the connection when things are finished. If this method is not executed, the Node.js program will not exit, because the connection object is waiting to be used and listening to a socket.
- Instead of using a callback paradigm, due to improvements in ES2017 and Node.js version 7.6, there is full support for the async/await paradigm to be used and is recommended. By using the async/await paradigm, all asynchronous calls with callbacks can be replaced with a call to the same method, but without supplying a callback. Using `await` before the method call will simulate a synchronous call by *waiting* for the call to complete and return the results. It makes things much easier to read and follow.
#### Schema Initialization:
- The mongo shell is an interactive shell and also a scripting environment.
- Here we create `init.mongo.js` which serves as a schema initialization script in the `script` directory.
- If at any point we wish to reset the database to a pristine state, the command `mongo issuetracker scripts/init.mongo.js` can be run at the command line from the bash terminal.
#### Reading From MongoDB:
- Here we change the List API to read from the MongoDB database rather than the in-memory array of issues in the server.
- The application is to maintain a connection with the MongoDB server so we can reuse it perform many operations, triggered from within API calls.
- The connection object is in fact a connection pool. It automatically determines the best thing to do: reuse an existing TCP connection, reestablish a new connection when the connection is broken, tec. Using a global variable (at least reusing the connection object) is recommended usage.
#### Writing to MongoDB:
- Here we change the Create API to create issues that use the MongoDB database to persist newly created issues.
- A `counter` collection is used to store a current count of issues that can be used to generate unique `id` fields at the time of creation of a new issue by using the `findOneAndUpdate()` method.

### Errors & Issues:
- Received a `DeprecationWarning` whenever running the MongoDB server.  I enabled the `useUnifiedTopology` flag in the MongoClient Constructor to remove the deprecation warning.


## Chapter 5
### Summary & Functionality Added:
This chapter introduced more specifics of handling server-side requests. The author speaks at greater detail about Express as the web server frame work built on top of Node, and GraphQL as a query language used to describe requests from a web client to a web server. It is used to load data from a server to a client.

At the conclusion of the chapter the following functionality is added to the Issue Tracker application:
- Using GraphQL a Create Issue API was implemented and integrated to that new issues could be added to the list of issues with an automated 10-day buffer for the due date.
- Input validations to the Issue Tracker were also added that would display to the user in the form of an `alert`. The following validations were performed:
    1. Field title must be at least 3 characters long.
    2. Field owner is required to be filled in if the status is "Assigned"
    3. validate date strings on their way in.
    
    ![ch05](/readme_images/ch5.png)

### Chapter 5 Notes:
#### Express:
- **Routing** - At the heart of Express is a router, which takes a client request, matches it against any routes that are present, and executes the handler function that is associated with that route. The handler function is expected to generate the appropriate response. 
    -  A route specification consists of:
        - An HTTP method(GET, POST, etc.).
        - a path specification that matches the request URI
        - and the route handler
        - Instead of `app.use()`, `app.get()` has to be used in order to match the GET HTTP method.
- **Request Matching** - When a request is received, the first thing that Express does is match the request to one of the routes. The request method is matched against the route's method.
- **Route Parameters** - Route parameters are named segments in the path specification that match a part of the URL. If a match occurs, the value in that part of the URL is supplied as a variable in the request object. Note that the query string is not part of the path specification, so you cannot have different handlers for different parameters or values of the query string.
- **Route Lookup** - The router does not try to find a best match, it tries to match all routes *in the order* in which they are installed, and the first match is used. This means that the routes should be defined in the order of priority. Typically, you should be careful to add the more generic pattern after the specific paths in case a request can match both.
- **Handle Function** - Once a route is matched, the handler function is called. The parameters passed to the handler are a request object and a response object.
- **Request Object** - Any aspect of the request can be inspected using the request objects properties and methods.
- **Response Object** - The response object is used to construct and send a response. Note that if no response is sent, the client waits indefinitely.
- **Middleware** - An *Express* application is a series of middleware function calls. Middleware functions are those that have access to the request object (`req`), the response object (`res`), and the next middleware function in the application's request-response cycle. `express.static()` is the only built-in middleware (other than the router) available as part of *Express*. Third-party middleware is available via `npm`.
#### REST API:
- REST is short for **Representational State Transfer**, and is an architectural pattern for application programming interfaces (APIs).
- The APIs are resource based (instead of action based). Resources are accessed based on a Uniform Resource Identifier (URI), known as an endpoint. As such, resources are nouns, not verbs.
- In a REST API, to access an manipulate the resources, on uses HTTP methods. While resources were nouns, the HTTP methods are the verbs that operate on them.
- REST APIs have a few issues laid out on **pg. 90**. The author states that given these issues, most REST API implementations are more REST-*like*, rather than strict REST.
#### GraphQL:
- In GraphQL, the properties of an object that need to be returned **must** be specified.
- GraphQL API servers have a *single* endpoint in contrast to one endpoint per resource in REST. This makes it possible to use a single query for *all* the date that is required by the client.
- GraphQL is a strongly typed language. All fields and argument have a type against which both queries and results can be validated and give descriptive error message. The advantage of a strongly typed system is that it prevents errors.
- For JavaScript on the back-end, there is a reference implementation of Graph QL called GraphQL.js. To tie this to *Express* and enable HTTP requests to be the transport mechanism for API calls, there is a package called `express-graphql`.
#### The About API:
- Here we create a demo API called about that simply returns a String.
- The GraphQL schema language requires us to define each type using the `type` keyword followed by the name of the type, followed by its specification within curly braces.
- GraphQL schema has two special types that are entry points into the type system, called `Query` and `Mutation`. `Query` fields are expected to return *existing state*, whereas `Mutation` fields are expected to change something in the application's data. Note that query fields are executed in parallel, and mutation fields are executed in series.
- Best practice to implement READ operation under `Query` and things that modify the system under `Mutation.`
- GraphQL type system supports the following basic data types:
    - `Int`: Signed 32-bit integer.
    - `Float`: A signed double-precision floating-point value.
    - `String`: A UTF-8 character sequence.
    - `Boolean`: `true` or `false`.
    - `ID`: This represents a unique identifier, serialized as a string. Using an `ID` instead of a string indicates that it is not intended to be human-readable.
- The Schema Language has a provision to indicate whether a value is optional or mandatory. By default, all values are optional. All those that require a value are defined by adding an exclamation character (`!`) after the type.
- `resolvers` are function are "handler" functions that are called when fields are accessed. They resolve a query to a field with real values.
- All resolver functions are supplied four arguments like this:
    `fieldName(obj, args, context, info)`
    see **pg. 95** for description of each argument.
- The tool called *Playground* is available by default as part of the Apollo Server and can be accessed by simply browsing the API endpoint. This allows developers to explore the API with a Playground UI.
- In the GraphQL Playground, the query language has to be used to write a query on the left hand side of the window. It is JSON-like, but it is not JSON. The Playground queries the schema from the server when the "play" button is hit. Results are shown on the right hand side.
#### GraphQL Schema File
- Here we move the schema definitions out of `server.js` and into their own file `schema.graphql`.
- we read the typdefs from `schema.grahql` into the `server.js` file using the `fs` module and the `readFileSync` function.
- Lastly, we modify the `package.json` file to make sure the script for `npm start` watches changes to any `.graphql` files, using the `-e` option for `nodemon`.
#### The List API:
- Here we implement an API to fetch a list of issues.
- The GraphQL way to specify a list of another type is to enclose it within square brackets.
#### List API Integration:
- Here we replace the `loadData()` method in `IssueList` React component with an `async` method that constructs a GraphQL query to fetch data from the server.
#### Custom Scalar Types:
- JSON does not have a `Date` type, thus transferring data using JSON in API calls also must convert the date to and from strings.
- To be able to use a custom scalar type, the following has to be done:
    1. Define a type for the scalar using the `scalar` keyword instead of the `type` keyword in the schema.
    2. Add  top-level resolver for all scalar types, which handles both serialization (on the way out) as well as parsing (on the way in) via class methods.
- The class method `serialize()` is will be called to convert a date value to a string.
- A *reviver* function is used in `App.jsx` to convert the string to the native `Date` type. The `reviver` function is passed to the JSON `parse()` function. A reviver function is one that is called for parsing all values, and the JSON parser gives it a chance to modify what the default parser will do.
#### The Create API:
- Here we implement an API for creating a new issue in the server, which will be appended to the list of issues in the server's memory.
- input types require a separate schema definition in GraphQL. The `input` keyword is used for defining input types.
- `""` Double quotes are used for documentation purposes that are shown as part of the schema explorer. In order for the documentation to appear in the schema explorer, the String must be a comment above a field within the `.graphql` file.
- It is typically good practice to return values generated at the server.
- Since `IssueInputs` does have a `GraphQLDate` type, parsers for receiving date values must be implemented. Specifically, `parseValue` and `parseLiteral`.
- `parseLiteral` is called in the case where the field is specified in-place in the query. The method is called with an argument `ast` which contains a `kind` property and a `value` property. The `kind` property indicates the type of token the parser found (float, integer, or string).
- A return value of `undefined` indicates to GraphQL library that the type could not be converted, and it will be treated as an error.
- A default value can be defined in schema by adding an `=` sign and the default value after the type specification. e.g. `status: String = "New"`.
### Create API Integration:
- Here we fully integrate the functionality of adding an issue to our issue list and implement a change in the `handleSubmit()` method for class IssueAdd so that a due date 10 days from today automatically gets generated.
#### Query Variables:
- Here we modify the asynchronous `createIssue()` within `IssueList` to utilize query variables, instead of using a string template, to address the previous problem on not being able to take `""` within the `title` field of the issueAdd form.
- GraphQL has a first-class way to factor dynamic values out of the query and pass them as a separate dictionary. These values are called *variables*.
- To use variables, the operation must first be named after the `mutation` or `query` field specification. The input value has to be replaced with a variable name. Variables start with a `$` character, e.g. `$message`.
- GraphQL specification allows multiple operations to be present in the same query string. Button only one of these can be execute in one call. The value of `operationName` specifies which of those operations needs to be executed.
#### Input Validations:
- Here we add the following input validations to the Issue Tracker:
    1. Field title must be at least 3 characters long.
    2. Field owner is required to be filled in if the status is "Assigned"
    3. validate date strings on their way in.
- We define an enum schema for `status`, which will allow us to have predefined values from a dropdown menu. Note that JavaScript does not have enum types, so the values will be dealt with as strings, both in the client as well as the server.
- The Apollo Server recommends using the `UserInputError` class to generate user errors.
- The Apollo Server has a configuration called `formatError` that can be used to make changes to the way an error is sent back to the caller. We use this option to print out any errors to the console for debugging/development purposes.
#### Displaying Errors:
- Here we modify the user interface to show any error messages to the user. We deal with transport errors due to network connection problems and invalid user input.
- We create an asynchronous utility function called `graphQLFetch()` to handle all API calls and report errors.
### Errors & Issues:
- Initial setup of ApolloSever was repeatedly unsuccessful from **pg. 97**. After checking my work repeatedly, and running `npm  start`, I kept receiving an error that read as follows: `Error: Cannot find module 'graphql/validation/rules/PossibleTypeExtensions'`. After cross referencing the author's repo I noted that his dependencies for `apollo-server-express` were set to version `2.3.1`, whereas mine were only at `2.13.1`. I ran `npm install graphql@0 apollo-server-express@2.3` to force install the apollo server dependency to version `2.3+` instead, which solved the problem. 
- In `server.js` I accidentally did not correctly implement the `validateIssue()` function. For the last check:
    `if (errors.length > 0) {
    throw new UserInputError('Invalid input(s)', {errors});
    }`
    I did not wrap `errors` with `{}`. This later caused issues because when testing to see if Errors were properly displayed with `alert()` in `graphQLFetch()` in `App.jsx`, errors were not being properly displayed.
- The function shown as `validateIssue(_, { issue })` on the bottom of page 123 and on page 125 is incorrectly named and has the wrong parameters. It should be `issueValidate(issue)` as called at the top of page 126.



## Chapter 4
### Summary & Functionality Added:
This chapter explores how React handles model information using **state** and **properties**. This chapter walkthrough allows us to add the functionality of being able to add and create new issues interactively via a form with a submission button.

![ch04](/readme_images/ch4.png)

### Chapter 4 Notes:
#### Initial State:
- The state of a `component` is captured in a variable called `this.state` in the component's class, and should be an object of one or more key-value pairs. Each key is a state variable name and the value is the current value of the variable. It is useful to store anything that affects the rendered view and can change due to any event in the **state**.
#### Async State Initialization:
- It is unlikely that regular SPA (Single Page Application) components will have the initial state available to them statically. They are typical fetched form the server. For our initial list of issues, to be displayed, they would need to be fetched via an API call.
- The **state** can only be assigned a value in the constructor. After, the **state** can be modified, but only via a call to `React.Component`'s `this.setState()` method. The method takes a single argument ,which is an object containing the changed state variables and their corresponding values.
- Here a `setTimeout()` method call is used to simulate an asynchronous call to the server.
- The `constructor()` for the `IssueTable` class only constructs the *component*, it does not render the UI. As such, if the `this.setState()` method gets called before the component is ready to be rendered, errors occur.
#### Updating State:
- Added a `createIssue()` method to the `IssueTable` class to add a new issue. This allows us to change a portion of the **state**.
- The variable `this.state` in the component should always be treated as immutable.
- The only way to let React know something has changed, and to cause a re-render, is to call `this.setState()`.
- The `setState()` method needs a copy of the unchanged elements and a copy of the object that is being changed. There are libraries called *immutability helpers* such as `immutable.js` `(http://facebook.github.io/immutable-js/)`, which can be used to construct the new state object. *(See pg. 66).*
- React automatically propagates any changes to child components that depend on the parent component's state.
- When `render()` is called, this does not mean that the `DOM` is updated. Only the `virtual DOM` is recreated on each `render()`. Real `DOM` updates happens where there are differences.
#### Lifting State Up:
- Only parent components can pass information down to children. The way around this is to have the *common parent* contain the state and all the methods that deal with this state.
- Data can be passed in from a parent to child in the form of `props`.
- In ES2015, the arrow function has the effect of setting the context (the value of `this`) to the *lexical scope*. In order to have the proper scope when passing method data down to a child, the `bind()` method can be used to bind the method scope reference to the parent before passing the method to the child. It's best practice to bind the specified method within the constructor of the parent class.
#### Event Handling:
- Here we create a form with two text input fields and a button to allow a user to add an issue interactively.
- In order to prevent a form from being submitted when the **Add** button is clicked, we can call `preventDefault()` function on the event.
- `documents.forms.issueAdd` allows us to save the form and its contents to a variable, which we can then access to create a new issue using the `createIssue()` method via `this.props.createIssue()`.
- The `value` property (e.g. `form.owner.value`) allows us to obtain the user input value from the `DOM` element.
- Once a new issue has been added, in order for the changes to persist, we either need to save the change in local storage on the browser or save it in the server.
- The default action of a `form` is to a `GET HTTP` request with the values in the form.
#### Stateless Components:
- For performance reasons and for clarity of code, it is recommended that components with nothing but a `render()` method, aka *Stateless Components* are written as functions rather than classes. The functions would simply take in `props` and render based on it.
#### Designing Components:
| Attribute   | State                                  | Props                                                       |
|-------------|----------------------------------------|-------------------------------------------------------------|
| Mutability  | Can be changed using `this.setState()` | Cannot be changed                                           |
| Ownership   | Belongs to the component               | Belongs to an ancestor, the component gets a read-only copy |
| Information | Model information                      | Model information                                           |
| Affects     | Rendering of the component             | Rendering of the component                                  |

### Errors & Issues:
- No errors or issues.


## Chapter 3
### Summary & Functionality Added:
The purpose of this chapter was to introduce React components, and to use composition for composing larger elements. The functionality added during this chapter included using React classes instead of elements to depict components, and using `map()` to generate components based on an array of input data. The generated components are placeholders thus far for some components yet to be developed, but provided a skeleton structure for the main page of the Issue Tracker application.

![ch03](/readme_images/ch3.png)

### Chapter 3 Notes:

#### React Classes:
- React classes are created by extending `React`. `Component`, the base class from which all custom classes must be derived. With the class definition, at minimum a `render()` method is needed. This method is what React calls to display the component in the UI. `render()` must be provided otherwise the component will have no screen presence. The `render()` function is supposed to return an element( either native HTML or another React component).
- Since `render()` returns only a single element, if one wants to return multiple, then there are two options:
    1. Create a single `<div>` element that encloses the other elements; or
    2. Return a `React.Fragment` component that encloses the other elements. The `Fragment` component is like an enclosing `<div>` but has no effect on the `DOM`.
- Run time errors for the React library can be seen in the browser JavaScript Console. Similarly, regular JavaScript Errors are also seen in the browser JavaScript Console.
#### Composing Components:
- Component composition is one of the most powerful features of React.
- A component takes input (called properties) and its output is the rendered UI of the component.
- Things to remember when composing components:
    - Larger components should be split into fine-grained components when there is a logical separation possible between the fine-grained components.
    - When there is an opportunity for reuse, components can be built which take in different inputs from different callers.
    - React's philosophy prefers component composition over inheritance.
    - In general, remember to keep coupling between components to a minimum.
    - As mentioned earlier the use of a `React.Fragment` component is not reflected in the `DOM`. This can be useful for certain uses cases. The book provides an example of needing to return table rows.
#### Passing Data Using Properties:
- The way to switch to JavaScript syntax within any JSX snippet is to use curly braces`{}`, to encapsulate the JavaScript.
- The easiest way to pass data to child components is using an attribute (custom or otherwise) when instantiating a component.
- For a complete list of DOM elements and how HTML attributes need to be specified in JSX, see :
https://reactjs.org/docs/dom-elements.html
#### Passing Data Using Children:
- Just like regular HTML, React components can be nested. When React components are converted to HTML element, the elements nest in the same order. React components can act like the `<div>` and take in nested elements. In such a case, the JSX expression will need to include both the opening and closing tags, with the *child* elements nested in them.
#### Dynamic Composition:
- This section replaces the hard-coded set of `IssueRow` components with programmatically generated set of components from an array of issues.
- The `map()` `Array` method is used to map an issue object to an `IssueRow` instance. A `for` loop can not be used instead of the `map()` method, because JSX is not a templating language. JSX only allows JavaScript expressions in the `{}` (curly brackets).
- Every instance of `IssueRow` needed to be identified with an attribute called `key`. React uses the `key` to optimize the calculation of difference when things, change, e.g. a new row is inserted. Here we end up using `ID` of each issue as the `key`, since each uniquely identifies the row.
- React does not automatically call `toString()` on objects that are to be displayed, therefore objects (in this case a `Date`) need to be explicitly converted to strings.

### Errors & Issues:
- Listing 3-6 is missing an opening single quote for  `New` in and should read `...status: 'New'`.
- In Listing 3-8, I accidentally did not initially change the `issues.map()` method contents. Specifically, I did not change `rowStyle` to `key`, within the `IssueRow` mapping, causing the browser to not render anything.


## Chapter 2
### Summary:
Served as an introduction to how React applications can be built. Provides an introduction using Node.js and NPM. Also installed Babel in order to be able to transpile code for support of older browsers.

![ch02](/readme_images/chapter2_hello_continents.png)

### Chapter 2 Notes:

- React is a JavaScript file that comes in two parts:
    1. The first is the React core module, the one responsible for dealing with React components, their state manipulation, etc.
    2. The second is the ReactDOM module, which deals with converting React components to a DOM that the browser can understand.
 - JSX (JavaScript XML) is a React markup language with similar syntax to HTML.
- Babel is used to compile JSX into regular JavaScript to be injected and used by the browser.
- npm (Node Package Manager) is powerful with many options. The location of installed files under a project directory is a conscious choice made by the makes of npm. It has three (3) important effects:
    1. All installations are *local* to the project directory. This means that a different project can use a different version of any of the installed packages.
    2. A package's dependencies are also isolated within the package.
    3. Administrator (superuser) rights are note needed to install a package.
- Command to start the server: `npm start`.
- To determine the babel version after installation without local directory file path constraints, the command  `npx babel --version` can be executed at the command line.
- Custom `npm run` scripts can be written and added to the `package.json` file. 
- `npm run watch` shortcut command was implemented. Its purpose is to watch the client-side code where the source files are changed frequently, and automatically recompile.
- `npm start` shortcut command was implemented. Its purpose is to restart `Node.js` whenever there is a change in a set of files. Here we make sure that there `server` directory is tracked for changes, and `Node.js` is restarted accordingly..
- When the command  `npm run watch` is executed a JSX transform is performed, but it doesn't return to the shell. It waits in a permanent loop by watching for changes in the source files. In order to run the server, another terminal is needed, where `npm start` can be executed.

### Errors & Issues:
 - Listing 2-1 should read  `ReactDOM.render(element, document.getElementByID('contents'));`. The listing has a typo and pass the argument `content` instead of `contents` inside the `getElementByID()` method. The typo causes the method to return `null` and not properly render *"Hello World"* because no element with that ID exists.
 - For build time JSX transformation, babel tools needed to be installed. I had an issue with installation. Resolved after realizing that `npm install --save-dev @babel/core@7 @babel/cli@7` needed to be executed within the `src` folder.
 - Listing 2-7 is missing an opening `<` and should read  `<script src="App.js></script>`.


