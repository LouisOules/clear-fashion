const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const PORT = 8092;

const app = express();

module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

const uri = 'mongodb+srv://louisoules:iyZZqeuQC63HJvI6@cluster0.pdlqo9a.mongodb.net/test?retryWrites=true&writeConcern=majority';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


app.get('/products', async (request, response) => {
  try {
    await client.connect()
    const products = await client.db("clearfashion").collection("products").find().toArray();
    await client.close()
    response.status(200).send(products);
  } catch(error) {
    console.log(error)
  }
});

app.get('/products/:id', async (request, response) => {
  try {
    await client.connect()
    const product = await client.db("clearfashion").collection("products").find({_id: ObjectId(request.params.id)}).toArray();
    await client.close()
    response.status(200).send(product[0]);
  } catch (error) {
    console.log(error)
  }
})

app.get('/products//search', async (request, response) => {
  try {
    await client.connect()
    const new_query = {}
    if (request.query.brand) new_query.brand = request.query.brand
    if (request.query.price) new_query.price = Number(request.query.price)
    console.log(new_query)
    const product = await client.db("clearfashion").collection("products").find(new_query).limit(parseInt(request.query.limit) || 0).toArray();
    await client.close()
    response.status(200).send(product);
  } catch (error) {
    console.log(error)
  }
})

app.listen(PORT);

console.log(`📡 Running on port ${PORT}`);
