const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
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
    const database = client.db(`${process.env.DB_NAME}`);
    const servicesCollection = database.collection('services');

    // GET API
    app.get('/all-services', async (req, res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });

    // GET SINGLE SERVICE
    app.get('/service/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await servicesCollection.findOne(query);
      res.send(service);
    });

    // POST API
    app.post('/add-services', async (req, res) => {
      const service = req.body;
      const result = servicesCollection.insertOne(service);
      res.json(result);
    });

    // DELETE API
    app.delete('/service/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = servicesCollection.deleteOne(query);
      res.json(service);
    });
  } finally {
    // await client.close()
  }
}

run().catch(console.dir);

// ROOT URL
app.get('/', (req, res) => res.send('Welcome to Genius Car Mechanics Server'));
app.listen(port, () => console.log(`Genius server running on ${port} PORT`));
