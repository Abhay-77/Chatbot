import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function test() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    if (process.env.NODE_ENV !== "production") {
      console.log("Connected to database");
    }
  } catch (e) {
    console.error("Not able to estabilish connection", e);
  }
}

export { test, client };
