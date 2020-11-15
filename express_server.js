//for the server operations
const express = require('express');
const bodyParser = require("body-parser");

//to encrypt the cookies
let cookieSession = require('cookie-session');

//to hash the passwords
const bcrypt = require('bcrypt');

//to be able to access the helper functions
const { generateRandomId, isEmailRegistered, verifyUserID } = require('./helpers');

//for the server operations
const app = express();
const PORT = 8080; // default port 8080

//set the view engine to ejs
//EJS knows where to look for the file, so no need to specify the views path in our routes
//EJS also knows it will deal with ejs templates, so no need to specify extension in our routes
app.set('view engine', 'ejs');

//to be able to use the body-parser
app.use(bodyParser.urlencoded({extended: true}));

//to allow us to use cookie-session
app.use(cookieSession({
  name: 'session',
  keys: ['key 1', 'key 2'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));


const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW"
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW"
  }
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

//checks if the password entered matches the one in DB
//returns boolean
const doesPasswordMatch = function(email, password, db) {

  //helper functions - returns user object if existing
  if (isEmailRegistered(email, db)) {
    for (const key in db) {
      if (bcrypt.compareSync(password, db[key].password)) {
        return true;
      }
    }
  }
  return false;
};

//sorts through the URLs connected to a specific user ID
//returns only the URLs we need
const urlsForUser = function(id) {
  const onlyUserURLs = {};

  for (const key in urlDatabase) {
    if (urlDatabase[key].userID === id) {
      onlyUserURLs[key] = urlDatabase[key];
    }
  }
  return onlyUserURLs;
};

//HOME PAGE ROUTES

//registers a handler on the root path -> redirects to /urls
app.get('/', (req, res) => {
  res.redirect('/urls');
});

//handles /urls route that shows a table of user's URLs
//corresponding template will condition user to be logged in to see data
app.get('/urls', (req, res) => {
  
  //set in register cookie
  const id = req.session.user_id;
  const user = users[id];
  
  const templateVars = {
    //reduce DB to user URLs only
    urls: urlsForUser(id),
    user
  };

  res.render('urls_index', templateVars);
});

//CREATE NEW SHORTURL

//handles post for URL submitted to be shortened
app.post("/urls", (req, res) => {
  const longURL = req.body.longURL; //<-- this comes from the form label in urls_new
  const newURLid = generateRandomId();
  const userID = req.session.user_id;

  urlDatabase[newURLid] = { longURL, userID };

  res.redirect(`urls/${newURLid}`);
});

//handles the path where URLs are submitted to be shortened
app.get("/urls/new", (req, res) => {
  const user = users[req.session.user_id];
  const templateVars = {
    user,
    urls: urlDatabase,
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL]
  };

  if (!user) {
    return res.redirect('/login');
  }

  res.render("urls_new", templateVars);
});

//DISPLAY OR UPDATE SHORT URL

//handles specific routes that show only one shortened link
app.get("/urls/:shortURL", (req, res) => {
  const user = users[req.session.user_id];
  
  const templateVars = {
    user,
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    error: 'Please log in or register to see your URLs!'
  };

  if (!user) {
    return res.render('error', templateVars);
  }

  res.render("urls_show", templateVars);
});

//handles the input coming from the update form on individual short URL pages
app.post("/urls/:shortURL", (req, res) => {
  //this is coming from our route
  const shortURL = req.params.shortURL;

  //this is coming from urls_show
  const newURL = req.body.longURL;

  //reassign the value in the object
  if (verifyUserID(req.session.user_id, urlDatabase[shortURL].userID)) {
    urlDatabase[shortURL].longURL = newURL;
  }

  res.redirect(`/urls/`);
});

//handles redirect from the shortened URL to the original one
app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL].longURL;

  //if the user does not put in full address
  if (!longURL.includes('http' || 'https')) {
    longURL = 'http://' + longURL; //<-- this will automatically redirect to HTTPS if available
  }

  res.redirect(longURL);
});

//DELETE URL

//allows the user to delete a shortened URL if logged in
app.post('/urls/:shortURL/delete', (req, res) => {
  const shortURL = req.params.shortURL;

  if (verifyUserID(req.session.user_id, urlDatabase[shortURL].userID)) {
    delete urlDatabase[shortURL];
  }
  
  res.redirect('/urls');
});

//LOGIN ROUTES

//login page
app.get('/login', (req, res) => {
  const user = users[req.session.user_id];
  const templateVars = { user };

  if (user) {
    return res.redirect('/urls');
  }

  res.render('login', templateVars);
});

//handles the post from the login page
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = isEmailRegistered(email, users);
  const passMatch = doesPasswordMatch(email, password, users);

  const templateVars = {
    user,
    passMatch,
    userErr: 'User does not exist',
    passErr: 'Check your spelling and try again!'
  };

  if (!user || (user && !passMatch)) {
    return res.render('login_error', templateVars);
  } else {
    req.session.user_id = user.id;
  }

  res.redirect('/urls');
});

//LOGOUT ROUTE

app.post('/logout', (req, res) => {
  //clears cookies
  req.session = null;
  res.redirect('/urls');
});

//REGISTER ROUTES

//handles register page
app.get('/register', (req, res) => {
  const templateVars = {
    user: users[req.session.user_id]
  };
  
  res.render('register', templateVars);
});

app.post('/register', (req, res) => {
  //storing email and password as plain text
  const { email, password } = req.body;

  const templateVars = {
    email,
    password
  };

  //if any of the two fields are empty, send error
  if (!email || !password) {
    return res.render('register_error', templateVars);
  }
  
  //if the email address is already in use, send error
  if (isEmailRegistered(email, users)) {
    return res.render('register_error', templateVars);
  }
  
  //else, create new user with email and hashed password
  const id = generateRandomId(); //<-- generates new user id
  const hashedPassword = bcrypt.hashSync(password, 10);

  const newUser = {
    id,
    email,
    password: hashedPassword
  };
  
  //add user to users database
  users[newUser.id] = newUser;
  
  //create cookie with user id
  req.session.user_id = id;
  res.redirect('/urls');
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});