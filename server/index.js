const express = require('express');
const mongoose = require('mongoose');
require("dotenv").config();

const userRouter =  require('./routes/user.route');

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("connected to mongo db");
} ).catch((err) => {
    console.log(err);
})

const app = express();

const PORT = 3000;


app.listen(PORT, () => {
    console.log("Server running on port : ", PORT);
})

// user routes
app.use("/api/user", userRouter);

app.get('/test', (req, res) => {
    res.json({"message": "Hello world"});
})
