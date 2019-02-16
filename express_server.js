var express = require('express');
var app = express();
var PORT = 8080 //Our default port for this app
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const bcrypt = require('bcrypt');

const hashedPassword = bcrypt.hashSync(password, 10);

app.use(bcrypt());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

function generateRandomString() {
  let random = Math.random().toString(36).substring(2, 8);
  return random;
}
let urlDatabase = {};

const users = {
  'hfgdsd' : {
    id: 'hfgdsd',
    email: "hello@gmail.com",
    password: "hello"
  }
  
};

app.get("/", (req,res) => {
  res.redirect("/urls");
});

app.get("/urls", (req, res) => {
  let templateVars = { 
    urls: urlDatabase,
    user: users[req.cookies["user_id"]]
  };
  res.render("urls_index", templateVars);
});

app.get("/registration", (req,res) => {
  let templateVars = { 
    urls: urlDatabase,
    user: req.cookies["user_id"]
  };
  res.render("registration", templateVars);
})

app.post("/registration", (req,res) => {
  let randomID = generateRandomString();
  let userlist = users;

   for(var values in userlist) {
    if(req.body["email"] === userlist[values].email) {
    res.status(400);
    res.send("User already registered - please log in.")
      }
    }
    if(req.body["user_id"] === "" || 
  req.body["email"] === "" || 
  req.body["password"] === "") {
    res.status(400);
    res.send("Please enter a valid email/password combo to continue.")
  }

  users[randomID] = {
  id: randomID,
  email: (req.body["email"]),
  password: bcrypt.hashSync((req.body['password']), 10)
    }
  res.cookie("user_id", randomID)
  res.redirect("/urls/")
  })

app.get("/urls/new", (req, res) => {
  let templateVars = { 
    urls: urlDatabase,
    user: users[req.cookies["user_id"]]
  };urlDatabase[req.params.shortURL]
    if(req.cookies["user_id"] === undefined) {
      res.redirect("/login")
    } else {
  res.render("urls_new", templateVars)
    }
})

app.post("/urls/:shortURL/editing", (req, res) => {
  urlDatabase[req.params.shortURL].longURL = req.body.longURL

  res.redirect("/urls");
})

app.get("/urls/:shortURL/edit", (req, res) => {
  let templateVars = { 
    urls: urlDatabase[req.params.shortURL],
    user: users[req.cookies["user_id"]],
    shortURL: req.params.shortURL,
  };
  res.render("urls_show", templateVars);
})
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];  
  res.redirect("/urls");
})

app.get("/login", (req, res) => {
  let templateVars = { 
    urls: urlDatabase,
    user: users[req.cookies["user_id"]]
  };
  res.render("login", templateVars);
});

app.post("/loginSubmit", (req, res) => {
  let userList = users;
  let elUser = null
  for(var key in userList) {
    if ((req.body.email) === userList[key].email &&
    (req.body.password) === userList[key].password) {
    elUser = userList[key].id;
    }
  }
  if(elUser == null) {
    res.status(400).send("Incorrect username or password entered - please try again");
  } else {
    res.cookie("user_id", elUser);
    res.redirect("/urls");
  }
});

app.post("/logout", (req, res) => {
    res.clearCookie("user_id");
    res.redirect("/urls");
  });

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { 
    urls: urlDatabase[req.params.shortURL],
    user: users[req.cookies["user_id"]],
    shortURL : req.params.shortURL
  };
  res.render("urls_show", templateVars);
});

app.get("/urls.json", (req, res) => {
  let templateVars = { urls: urlDatabase[req.params.shortURL],
    userID: req.cookies["user_id"]
  };
  res.json(templateVars);
});

app.post("/urls", (req, res) => {
  let randomNumber = generateRandomString();
  urlDatabase[randomNumber] = {
    longURL: req.body.longURL,
    userID: req.cookies["user_id"]
    }
  res.redirect("/urls/" + randomNumber);
});

  app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  console.log(longURL);
  res.redirect("http://" + longURL);
  });

app.listen(PORT, () => {
  console.log(`Example app listing on port ${PORT}!`)
});

