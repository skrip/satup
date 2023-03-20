import * as mongoDB from "mongodb";

export enum colName {
  CUSTOMERS = "customers",
}

export const DB: {
  client?: mongoDB.MongoClient;
} = {};

export const collections: {
  customers?: mongoDB.Collection;
} = {};

export async function connectToMongoDB() {
  /* skip if already have connection */
  if (Object.keys(collections).length === 0) {
    const MONGODB_URI = process.env.MONGODB_URI
      ? process.env.MONGODB_URI
      : "mongodb://localhost:27017?retryWrites=true&w=majority";
    const MONGODB_NAME = process.env.MONGODB_NAME
      ? process.env.MONGODB_NAME
      : "datatest";

    let options = {
      directConnection: true,
    };

    if(MONGODB_URI.includes('mongodb+srv')){
      options = {
        directConnection: false,
      };
    }
    console.log("mongodb ", MONGODB_URI);
    const client: mongoDB.MongoClient = new mongoDB.MongoClient(
      MONGODB_URI,
      options
    );

    try {
      await client.connect();
      DB.client = client;
      const db: mongoDB.Db = client.db(MONGODB_NAME);

      const customersCollection: mongoDB.Collection = db.collection(
        colName.CUSTOMERS
      );
      collections.customers = customersCollection;

      console.log("Successfully connected to database: ");
    } catch (err) {
      console.error(err);
    }
  }
}
