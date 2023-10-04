const express = require('express');
const mongoose = require('mongoose');
require("dotenv").config();

const userRouter =  require('./routes/user.route');
const authRouter = require('./routes/auth.route')
mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("connected to mongo db");
} ).catch((err) => {
    console.log(err);
})

const app = express();
app.use(express.json());

const PORT = 3000;


app.listen(PORT, () => {
    console.log("Server running on port : ", PORT);
})

// user routes
app.use("/api/user", userRouter);

// authentication routes
app.use("/api/auth", authRouter);

app.get('/api/test', (req, res) => {
    res.json({"message": "Hello world"});
})
