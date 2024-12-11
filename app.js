const { MongoClient } = require('mongodb');

// MongoDB connection URI
const uri = 'mongodb+srv://admin1:0000@cluster0.lfn0u.mongodb.net/university?retryWrites=true&w=majority';

async function testConnection() {
    const client = new MongoClient(uri);

    try {
        // Connect to the MongoDB Atlas cluster
        await client.connect();
        console.log("Successfully connected to MongoDB Atlas!");

        // Select the 'universty' database
        const db = client.db("universty");

        // List all collections in the 'universty' database
        const collections = await db.collections();
        console.log("Collections in 'universty' database:", collections.map(col => col.collectionName));

        // Example: Querying the 'students' collection
        const studentsCollection = db.collection('students');
        const students = await studentsCollection.find().toArray();

        // Log the full student data
        console.log("Students:", JSON.stringify(students, null, 2));

    } catch (error) {
        console.error("Error connecting to MongoDB Atlas:", error);
    } finally {
        await client.close();  // Ensure the connection is closed after operations
    }
}

testConnection();
