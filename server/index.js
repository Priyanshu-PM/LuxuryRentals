const express = require('express');
const mongoose = require('mongoose');
require("dotenv").config();

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("connected to mongo db");
} ).catch((err) => {
    console.log(err);
})

const app = express();

const PORT = 3000
app.listen(PORT, () => {
    console.log("Server running on port : ", PORT);
})