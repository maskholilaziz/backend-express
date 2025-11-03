// import exporess
const express = require("express");

// import CROS
const cors = require("cors");

// import bodyParse
const bodyParser = require("body-parser");

// init app
const app = express();

// use CROS
app.use(cors());

// use body parser
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

// define port
const port = 3000;

// define route
app.get("/", (req, res) => {
    res.send("Hello World!");
});

// start server
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})