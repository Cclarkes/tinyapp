var express = require('express');
var app = express();
var PORT = 8080 //Our default port for this app
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

function generateRandomString() {
    let random = Math.random().toString(36).substring(2, 8);
    return random;
}
let urlDatabase = {
    "b2xVn2": "http://www.lighthouselabs.ca",
    "9sm5xK": "http://www.google.com"
};

app.get("/", (req,res) => {
    res.send("Hello!");
});

app.get("/hello", (req, res) => {
    res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
    let templateVars = {urls: urlDatabase};
    res.render("urls_index", templateVars);
});

app.get("/urls/new", (reg, res) => {
    res.render("urls_new")
})

app.post("/urls/:shortURL/editing", (req, res) => {
    urlDatabase[req.params.shortURL] = (req.body.longURL);
    console.log(urlDatabase);
    res.redirect("/urls");
})

app.get("/urls/:shortURL/edit", (req, res) => {
    console.log(req.params.shortURL)
    let editVar = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
    res.render("urls_show", editVar);
})
app.post("/urls/:shortURL/delete", (req, res) => {
    delete urlDatabase[req.params.shortURL];  
    res.redirect("/urls");
})


app.get("/urls/:shortURL", (req, res) => {
    let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
    res.render("urls_show", templateVars);
  });

app.get("/urls.json", (req, res) => {
    res.json(urlDatabase);
});

app.post("/urls", (req, res) => {
    console.log(req.body);
    let randomNumber = generateRandomString();
    urlDatabase[randomNumber] = (req.body.longURL);
    res.redirect("/urls/" + randomNumber);         // Respond with 'Ok' (we will replace this)
  });

  app.get("/u/:shortURL", (req, res) => {
    const longURL = urlDatabase[req.params.shortURL]
    res.redirect(longURL);
  });

app.listen(PORT, () => {
    console.log(`Example app listing on port ${PORT}!`)
});
