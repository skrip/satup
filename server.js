const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const hostname = process.env.HOSTNAME
    ? process.env.HOSTNAME
    : "localhost";
const port = process.env.PORT
    ? parseInt(process.env.PORT)
    : 3000;

// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()
const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = process.env.MONGODB_URI
    ? process.env.MONGODB_URI
    : "mongodb://localhost:27017?retryWrites=true&w=majority";

const mongoName = process.env.MONGODB_NAME
      ? process.env.MONGODB_NAME
      : "datatest";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri,  {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    }
);

let dt = [
    {
      firstName: "Antonio",
      lastName: "Banderas",
      email: "antonio.banderas@gmail.com",
      gender: "male",
      address: [
        {
          street: "Upper Street",
          house: "No 1",
          city: "New York",
          country: "USA",
        },
      ],
    },
    {
      firstName: "Celine",
      lastName: "Dion",
      email: "celine.dion@gmail.com",
      gender: "female",
      address: [
        {
          street: "Upper Street",
          house: "No 3",
          city: "New York",
          country: "USA",
        },
        {
          street: "Upper Street",
          house: "No 1",
          city: "London",
          country: "UK",
        },
      ],
    },
    {
      firstName: "Enrique",
      lastName: "Felipe",
      email: "Enrique.Felipe@gmail.com",
      gender: "male",
    },
]

async function run() {
  try {
    await client.connect();
    let db = await client.db(mongoName);
    let customersCollection = await db.collection('customers');

    let ls = await db.listCollections().toArray();
      let idxcus = ls.findIndex((n) => n.name == "customers");
      if (idxcus == -1) {
        /* migrate */
        let c = await customersCollection.find({}).toArray();
        if(c.length == 0){
            await customersCollection.updateOne(dt[0], {$set: dt[0]}, {upsert: true});
            await customersCollection.updateOne(dt[1], {$set: dt[1]}, {upsert: true});
            await customersCollection.updateOne(dt[2], {$set: dt[2]}, {upsert: true});
        }
      }
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

app.prepare().then(async () => {
  
    await run();

  createServer(async (req, res) => {
    try {
      // Be sure to pass `true` as the second argument to `url.parse`.
      // This tells it to parse the query portion of the URL.
      const parsedUrl = parse(req.url, true)
      const { pathname, query } = parsedUrl

      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })
    .once('error', (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`)
    })
})