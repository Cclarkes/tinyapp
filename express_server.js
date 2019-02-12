var express = require('express');
var app = express();
var PORT = 8080 //Our default port for this app

let urlDatabase = {
    "b2xVn2": "http://www.lighthouselabs.ca",
    "9sm5xK": "http://www.google.com"
};

app.get("/", (req,res) => {
    res.send("Hello!");
});

app.listen(PORT, () => {
    console.log(`Example app listing on port ${PORT}!`)
});
