const express = require('express');
const app = express();
const port = 3000;

app.use("/", express.static("public/index"))

app.listen(port, () => {
    console.log("Port open at 3000")
})