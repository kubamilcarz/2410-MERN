import express from "express";

const app = express();
const port = 5000;

app.get("/", (request, result) => {
    result.send("Hello, world!")
});

app.listen(port, () => {
    console.log("Server running on port: " + port);
});