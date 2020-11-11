const express = require('express');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const generateRandomString = require('./helper_functions');

const app = express();
const PORT = 8080; // default port 8080

// set the view engine to ejs
app.set('view engine', 'ejs');
// this is to be able to use the body-parser
app.use(bodyParser.urlencoded({extended: true}));
// this is to be able to use the cookie parser
app.use(cookieParser());

const urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com'
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
}

//ROOT ROUTE

//registers a handler on the root path -> redirects to /urls
app.get('/', (req, res) => {
  console.log('/');

  //res.send() will work for simple text
  //for more complex page rendering, we use ejs
  res.send('Hello!');
  res.redirect('/urls');
});

//HOME PAGE ROUTES

//EJS knows where to look for the file, so no need to specify the views path
//EJS also knows it will deal with ejs templates, so no need to specify extension
//handles /urls route that shows a table of shortened URLs
app.get('/urls', (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    username: req.cookies.username
  };

  console.log('/urls get');
  res.render('urls_index', templateVars);
});

//this will return a req.body in the form of an object {longURL: value input}
//it knows to do this because of the form formatting in urls_new
//the body is originally a JSON string, but it gets parsed with body-parser
app.post("/urls", (req, res) => {
  const newURL = req.body.longURL;
  let newURLid = generateRandomString();

  urlDatabase[newURLid] = newURL;

  console.log('/urls post');
  //console.log(req.body.longURL); <-- this comes from the form label in urls_new
  res.redirect(`urls/${newURLid}`);
});

//CREATE NEW SHORTURL

//handles the path where new URLs are submitted to be shortened
app.get("/urls/new", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    username: req.cookies.username
  };

  res.render("urls_new", templateVars);
});

//DISPLAY OR UPDATE SHORT URL

//handles specific short URL routes that show only one shortened link
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    username: req.cookies.username
  };

  console.log("/urls/:shortURL");
  res.render("urls_show", templateVars);
});

//this handles the input coming from the update form on individual short URL pages
app.post("/urls/:shortURL", (req, res) => {
  //this is coming from our URL
  const shortURL = req.params.shortURL;
  //this is coming from urls_show
  const newURL = req.body.longURL;

  //reassign the value in the object
  urlDatabase[shortURL] = newURL;

  res.redirect(`/urls/${shortURL}`);
});

//this will redirect the user from the shortened URL to the original one
app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];

  if (!longURL.includes('http://')) {
    longURL = 'http://' + longURL;
  }
  
  console.log("/u/:shortURL");
  res.redirect(longURL);
});

//DELETE URL

//this will allow the user to delete a shortened URL and redirect to urls_index
app.post('/urls/:shortURL/delete', (req, res) => {
  const shortURL = req.params.shortURL;
  console.log('/urls/:shortURL/delete', shortURL);
  
  delete urlDatabase[shortURL];
  res.redirect('/urls');
});

//LOGIN ROUTES

app.post('/login', (req, res) => {
  const username = req.body.username;
  
  res.cookie('username', username);
  res.redirect('/urls');
});

//LOGOUT ROUTES

app.post('/logout', (req, res) => {
  const username = req.body.username;

  res.clearCookie('username', username);
  res.redirect('/urls');
});

//REGISTER ROUTES

app.get('/register', (req, res) => {
  const templateVars = { 
    username: req.cookies.username
   };
  
  console.log('/register');
  res.render('register', templateVars);
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});