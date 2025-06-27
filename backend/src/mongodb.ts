const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://Hawk:Hawk%40doccheck@cluster0.kc205jc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
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
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (e) {
    console.log("Not able to estabilish connection",e);
  }
}

export { test, client };
