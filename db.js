const mongoose = require('mongoose');
require('dotenv').config();
const mongo_url = process.env.MONGO_URL; // Ensure the environment variable is correctly named

mongoose.connect(mongo_url, {
    useNewUrlParser: true, // Correct option for parsing the connection string
    useUnifiedTopology: true // Correct option for using the new server discovery and monitoring engine
});

const db = mongoose.connection; // Use mongoose.connection, not mongoose.connection()

db.on('connected', () => {
    console.log("Database is connected!");
});

db.on('error', (error) => {
    console.log("Error:", error);
});

db.on('disconnected', () => {
    console.log("Database is disconnected!");
});


