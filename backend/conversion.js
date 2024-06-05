const { MongoClient } = require("mongodb");
const { parse } = require("json2csv");
const fs = require("fs");

// MongoDB connection details
const uri = "mongodb+srv://mukulpersonal2003:NTtv8gfqHJsC90fH@cluster0.mkzoudt.mongodb.net"; // Change this to your MongoDB URI
const databaseName = "EcommerceWeb";
const collectionName = "products";

async function exportData() {
  // Create a new MongoClient
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    // Connect to the MongoDB server
    await client.connect();
    console.log("Connected to MongoDB");

    const database = client.db(databaseName);
    const collection = database.collection(collectionName);

    // Fetch data from MongoDB
    const data = await collection.find({}).toArray();

    // Export data to JSON file
    const jsonFilePath = "output.json";
    fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2));
    console.log(`Data exported to JSON file: ${jsonFilePath}`);

    // Convert data to CSV
    const csvFilePath = "output.csv";
    const csv = parse(data, { fields: Object.keys(data[0]) });
    fs.writeFileSync(csvFilePath, csv);
    console.log(`Data exported to CSV file: ${csvFilePath}`);
  } catch (err) {
    console.error(err);
  } finally {
    // Close the connection to MongoDB
    await client.close();
  }
}

// Run the export
exportData();
