const { MongoClient } = require("mongodb");
require("dotenv").config();
const log = require('electron-log');
const url = process.env.MONGODB_URL;
const dbName = process.env.DB_NAME;
// Function to connect to MongoDB
async function connectToMongoDB() {
  try {
    // Get MongoDB URL and database name from .env file
    // Create a new MongoClient
    const client = new MongoClient(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Connect to the MongoDB server
    await client.connect();
    
    console.log("Connected to MongoDB.");

    // Return the client and database object
    return client;
  } catch (error) {
    log.error("Error occurred while connecting to MongoDB:", error);
    throw new Error("Error occurred while connecting to MongoDB:");
  }
}
// Function to insert data into the blogs collection
async function insertData(data) {
  const { content, content_path, ...mongodbData } = data;
  const client = await connectToMongoDB();
  try {
    // Connect to MongoDB
    // Select the database and collection
    const db = client.db(dbName);
    const collection = db.collection("blogs");

    const result = await collection.insertOne(mongodbData);
    console.log(
      `Inserted ${result.insertedId} document into the blogs collection.`
    );
  } catch (error) {
    log.error("Error occurred while inserting data:", error);
    throw new Error("Error occurred while inserting data");
  } finally {
    // Close the connection
    client.close();
    console.log("Disconnected from MongoDB.");
  }
}
async function rollback(data) {
  const client = await connectToMongoDB();
  try {
    // Connect to MongoDB
    // Select the database and collection
    const db = client.db(dbName);
    const collection = db.collection("blogs");
    console.log(data._id);
    const result = await collection.deleteOne({ _id: data._id });
    console.log(`deleted ${data._id} document from the blogs collection.`);
  } catch (error) {
    log.error(
      "Error occurred while deleting data please delete the data from mongodb manually",
      error
    );
    throw new Error(
      "Error occurred while deleting data please delete the data from mongodb manually"
    );
  } finally {
    // Close the connection
    client.close();
    console.log("Disconnected from MongoDB.");
  }
}
module.exports = { insertData, rollback };
