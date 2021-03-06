require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');

// connects to dabatase
const { connectToDb } = require('./db.js');

// Appolo Server middleware
const { installHandler } = require('./api_handler.js');

const auth = require('./auth.js');

// Creates & initializes an express application.
const app = express();

app.use(cookieParser());
app.use('/auth', auth.routes);

installHandler(app);

// Environment variable for port
const port = process.env.API_SERVER_PORT || 3000;

// listen() method starts server and has it serve HTTP requests.
// starts the server and waits eternally for requests.
(async function start() {
  try {
    await connectToDb();
    app.listen(port, () => {
      console.log(process.env.API_SERVER_PORT);
      console.log(`API server started on port ${port}`);
    });
  } catch (err) {
    console.log('ERROR', err);
  }
})();
