const express = require('express');
const app = express();
const db = require('./db');
require('dotenv').config();
const bodyParser = require('body-parser');

// Middleware setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//logging 
const logRequest = (req, res, next) => {
    console.log(`[${new Date().toLocaleString()}] Request Made to : ${req.originalUrl}`);
    next(); // Move on to the next phase
}
app.use(logRequest);

// Routes
// const b = require('../NodeJs/server');
app.get('/', (req, res) => {
    res.send("Welcome to our site!!");
});

const userR = require('./routers/userRoutes');
app.use('/user', userR);

const orderR = require('./routers/orderRoutes');
app.use('/order', orderR);

const bookR = require('./routers/bookRoutes');
app.use('/book', bookR);

app.listen(3000, () => {
    console.log("Server running at 3000");
});
