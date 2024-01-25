const express = require("express");
const app = express();
const dotenv = require("dotenv").config()
const port = process.env.PORT;

const studentRoute = require("./routes/student_route");
app.use("/student", studentRoute);

const postRoute = require('./routes/post_route');
app.use('/post', postRoute);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
});