const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const app = express();
dotenv.config();

// Define variables
const port = process.env.PORT || 3001;
const databaseUrl = process.env.DATABASE_URL;
const databaseName = process.env.DATABASE_NAME;

function connectMongo() {
    try {
        mongoose.connect(databaseUrl + databaseName).then(() => {
            console.log("Database connected !");
        }).catch((err) => {
            console.log("Facing isuue on Database connection" + err);
        })
    } catch (error) {
        console.log("Facing isuue on Database connection" + error);
    }
}

connectMongo();

app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.set('trust proxy', 1) // trust first proxy


app.use('/api', require('./src/routes/user'));


app.listen(port, () => {
    console.log("Server is up on " + port );
})