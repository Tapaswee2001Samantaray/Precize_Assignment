const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes/route.js");
const app = express();

require("dotenv").config();
app.use(express.json());

mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true })
    .then(() => console.log("MongoDB is connected."))
    .catch((err) => console.log(err));

app.use("/", routes);

let port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log(`Express app is running on port number ${port}`);
});