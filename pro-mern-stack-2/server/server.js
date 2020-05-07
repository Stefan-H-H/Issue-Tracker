const express = require('express');

// Creates & initializes an express application.
const app = express();

//express.static()creates a middleware function
//app.use() method mounts the middleware function
app.use(express.static('public'));

// listen() method starts server and has it serve HTTP requests.
// starts teh server and waits eternally for requests.
app.listen(3000, function() {
    console.log("App started on port 3000");
});
