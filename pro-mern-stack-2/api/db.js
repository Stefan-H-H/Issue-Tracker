require('dotenv').config();
const { MongoClient } = require('mongodb');

let db;

async function connectToDb() {
  // database url
  const url = process.env.DB_URL || 'mongodb://localhost/issuetracker';
  const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  console.log('Connected to MongoDB at', url);
  db = client.db();
}

async function getNextSequence(name) {
  const result = await db
    .collection('counters')
    .findOneAndUpdate(
      { _id: name },
      { $inc: { current: 1 } },
      { returnOriginal: false }
    );
  return result.value.current;
}

// getter for database
function getDb() {
  return db;
}

module.exports = { connectToDb, getNextSequence, getDb };
