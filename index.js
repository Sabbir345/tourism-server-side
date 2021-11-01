const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cpllm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const databaseName = client.db("tourism")
        const offersCollection = databaseName.collection('offers');
        const reviewsCollection = databaseName.collection('reviews');
        const favoritesCollection = databaseName.collection('favorites');
        const orderCollection = databaseName.collection('orders');

        // const doc = {
        //     name: "Sabbir Ahmed",
        //     email: "sabbir@gmail.com",
        // }

        // const result = await offersCollection.insertOne(doc);

        // GET API
        app.get('/all-offers', async (req, res) => {
            const cursor = offersCollection.find({});
            const offers = await cursor.toArray();
            res.send(offers);
        });

        // GET API
        app.get('/all-reviews', async (req, res) => {
            const cursor = reviewsCollection.find({});
            const reviews = await cursor.toArray();
            res.send(reviews);
        });

        // GET API
        app.get('/all-favorites', async (req, res) => {
            const cursor = favoritesCollection.find({});
            const favorites = await cursor.toArray();
            res.send(favorites);
        });

        app.get('/offers/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const offers = await offersCollection.find(query).toArray();
            res.send(offers);
        });

        app.post('/new-offer', async (req, res) => {
            const newOffer = req.body;
            const result = await offersCollection.insertOne(newOffer);
            res.json(result);
        });

        app.post('/place-order', async (req, res) => {
            const newOrder = req.body;
            const result = await orderCollection.insertOne(newOrder);
            res.json(result);
        });

        // GET API
        app.get('/my-orders', async (req, res) => {
            const cursor = orderCollection.find({});
            const myOrders = await cursor.toArray();
            res.send(myOrders);
        });

        // GET API
        app.get('/manage-all-orders', async (req, res) => {
            const cursor = orderCollection.find({});
            const myOrders = await cursor.toArray();
            res.send(myOrders);
        });

    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running my Server');
});

app.listen(port, () => {
    console.log('Running Server on port', port);
})
