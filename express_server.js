var express = require('express');
var app = express();
var PORT = 8080 //Our default port for this app
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

app.use(cookieParser());
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

const users = {
  "Guest": {
    id: "Guest",
    email: "guest@gmail.com",
    password: "guest"
  }
};

app.get("/", (req,res) => {
  res.redirect("/urls");
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase,
    user: req.cookies["user_id"]
  };
  res.render("urls_index", templateVars);
});

app.get("/registration", (req,res) => {
  let templateVars = { urls: urlDatabase,
    user: req.cookies["user_id"]
  };
  res.render("registration", templateVars);
})

app.post("/registration", (req,res) => {
  let randomID = generateRandomString();
  let userlist = users;

   for(var values in userlist) {
    if(req.body["user_id"] === values ||
      req.body["email"] === userlist[values].email) {
    res.status(400);
    res.send("User already registered - please log in.")
      }
    }
    if(req.body["user_id"] === "" || 
  req.body["email"] === "" || 
  req.body["password"] === "") {
    res.status(400);
    res.send("Please enter a valid user/email/password combo to continue.")
  }
  users[randomID] = {
  id: (req.body["user_id"]),
  email: (req.body["email"]),
  password: (req.body['password'])
    }
  res.cookie("user_id", users[randomID])
  res.redirect("/urls/")
  })

app.get("/urls/new", (req, res) => {
  let templateVars = { urls: urlDatabase,
    user: req.cookies["user_id"]
  };
    if(req.cookies["user_id"] === undefined) {
      res.redirect("/login")
    } else {
  res.render("urls_new", templateVars)
    }
})

app.post("/urls/:shortURL/editing", (req, res) => {
  urlDatabase[req.params.shortURL] = (req.body.longURL);
  res.redirect("/urls");
})

app.get("/urls/:shortURL/edit", (req, res) => {
  let templateVars = { 
    urls: urlDatabase,
    user: req.cookies["user_id"], 
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL]
    
  };
  res.render("urls_show", templateVars);
})
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];  
  res.redirect("/urls");
})

app.get("/login", (req, res) => {
  let templateVars = { urls: urlDatabase,
    user: req.cookies["user_id"]
  };
  res.render("login", templateVars);
});

app.post("/loginSubmit", (req, res) => {
  let userList = users;
  let elUser = null
  for(var key in userList) {
    if ((req.body.username) === userList[key].id &&
    (req.body.password) === userList[key].password) {
    elUser = userList[key];
    }
  }
  if(elUser == null) {
    res.status(400).send("Incorrect username or password entered - please try again");
  } else {
    res.cookie("user_id", elUser);
    console.log(elUser.id);
    res.redirect("/urls");
    
  }
});

app.post("/logout", (req, res) => {
    res.clearCookie("user_id");
    res.redirect("/urls");
  });

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { urls: urlDatabase,
    user: req.cookies["user_id"],
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL]
  };
  res.render("urls_show", templateVars);
});

app.get("/urls.json", (req, res) => {
  let templateVars = { urls: urlDatabase,
    user: req.cookies["user_id"]
  };
  res.json(templateVars);
});

app.post("/urls", (req, res) => {
  let randomNumber = generateRandomString();
  urlDatabase[randomNumber] = (req.body.longURL);
  res.redirect("/urls/" + randomNumber);
  console.log(urlDatabase);
});

  app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]
  let templateVars = { urls: urlDatabase,
    user: req.cookies["user_id"]
  };
  res.redirect(longURL, templateVars);
  });

app.listen(PORT, () => {
  console.log(`Example app listing on port ${PORT}!`)
});

