const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// USE MIDDLEWARE
app.use(cors());
app.use(express.json());

// CONNECT WITH MONGODB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.2xoju.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    console.log('Connect to Database');
  } finally {
    // await client.close()
  }
}

run().catch(console.dir);

// ROOT URL
app.get('/', (req, res) => res.send('Welcome to Genius Car Mechanics Server'));
app.listen(port, () => console.log(`Genius server running on ${port} PORT`));
