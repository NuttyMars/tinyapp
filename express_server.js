//for the server operations
const express = require('express');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');


const app = express();
const PORT = 8080; // default port 8080

// set the view engine to ejs
//EJS knows where to look for the file, so no need to specify the views path in our routes
//EJS also knows it will deal with ejs templates, so no need to specify extension in our routes
app.set('view engine', 'ejs');
// this is to be able to use the body-parser
app.use(bodyParser.urlencoded({extended: true}));
// this is to be able to use the cookie parser
app.use(cookieParser());

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
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

//generates a random string of 6 characters (for short URLs)
const generateRandomId =  function() {
  let id = Math.random().toString(36).substring(2, 8);
  return id;
};

//checks if an email is already in the database
//returns user object if existing, false otherwise
const isEmailRegistered = function(email, db) {
  for (const key in db) {
      if(db[key].email === email) {
    return db[key];
    }
  }
  return false;
}

//checks if the password entered matches the one in DB
//returns boolean
const doesPasswordMatch = function(email, password, db) {
  if(isEmailRegistered(email, db)) {
    for (const key in db) {
      if(db[key].password === password) {
        return true;
      }
    }
  }  
  return false;
}

//sorts through the URLs connected to a specific user ID
//returns only the URLs we need
const urlsForUser = function(id) {
  const urlsOfUser = {};
  for (const key in urlDatabase) {
    if(urlDatabase[key].userID === id) {
      urlsOfUser[key] = urlDatabase[key];
    }
  }
  return urlsOfUser;
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

//handles /urls route that shows a table of shortened URLs
//corresponding template will condition user to be logged in to see data
app.get('/urls', (req, res) => {
  
  const id = req.cookies['user_id'];
  const user = users[id];
  
  const templateVars = {
    urls: urlsForUser(id),
    user
  };

  console.log('/urls get');
  res.render('urls_index', templateVars);
});

//this will return a req.body in the form of an object {longURL: value input}
//it knows to do this because of the form formatting in urls_new
//the body is originally a JSON string, but it gets parsed with body-parser
app.post("/urls", (req, res) => {
  const longURL = req.body.longURL; //<-- this comes from the form label in urls_new
  let newURLid = generateRandomId();

  const userID = req.cookies['user_id'];

  urlDatabase[newURLid] = { longURL, userID };

  console.log('/urls post');
  res.redirect(`urls/${newURLid}`);
});

//CREATE NEW SHORTURL

//handles the path where new URLs are submitted to be shortened
app.get("/urls/new", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user: users[req.cookies['user_id']],
  };

  const user = templateVars.user;

  if(!user) {
    return res.redirect('/login');
  }
  console.log("/urls/new");
  res.render("urls_new", templateVars);
});

app.post('/urls/new', (req, res) => {
  console.log('user/urls post', req.cookies['user_id']); //<-- user.id
  const longURL = req.params.longURL;
  console.log('longURL :', longURL);

});

//DISPLAY OR UPDATE SHORT URL

//handles specific short URL routes that show only one shortened link
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user: users[req.cookies['user_id']],
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
  console.log('newURL :', newURL);

  //reassign the value in the object
  if(urlDatabase[shortURL].userID === req.cookies['user_id']) {
    urlDatabase[shortURL].longURL = newURL;
  }
  
  res.redirect(`/urls/${shortURL}`);
});

//this will redirect the user from the shortened URL to the original one
app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL].longURL;

  //if the user does not put in full address
  if (!longURL.includes('http' || 'https')) {
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

  if(urlDatabase[shortURL].userID === req.cookies['user_id']) {
    delete urlDatabase[shortURL];
  }
  
  res.redirect('/urls');
});

//LOGIN ROUTES

app.get('/login', (req, res) => {
  const templateVars = {
    user: users[req.cookies['user_id']],
  };

  console.log('/login');
  res.render('login', templateVars);
})

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const user = isEmailRegistered(email, users);

  if(!user) {
    return res.send('403: Unathorised action. User does not exist')
  }

  if (!doesPasswordMatch(email, password, users)) {
    return res.send('403: Unathorised action. Check your spelling and try again!');
  } else {
    res.cookie('user_id', user.id);
  }

  console.log('/login post')
  res.redirect('/urls');
});

//LOGOUT ROUTES

app.post('/logout', (req, res) => {
  console.log('/logout');
  res.clearCookie('user_id');
  res.redirect('/urls');
});

//REGISTER ROUTES

app.get('/register', (req, res) => {
  const templateVars = { 
    user: users[req.cookies['user_id']]
  };
  
  console.log('/register');
  res.render('register', templateVars);
});

app.post('/register', (req, res) => {
  const { email, password } = req.body;

  //if any of the two fields is empty, send error
  if (!email || !password) {
    return res.send('Error 400: Input values cannot be empty.\nGo back and try again!');
  }
  
  //if the email address is already in use, send error
  if (isEmailRegistered(email, users)) {
    return res.send('Error 400: Email is in use.\nGo back and log in!');
  }
  
  //else, create new user with email and password provided
  const id = generateRandomId();
  const newUser = {
    id, 
    email, 
    password
  };
  
  //add user to users database
  users[newUser.id] = newUser;

  console.log('/register post');
  //create cookie with user id
  res.cookie('user_id', id);
  res.redirect('/urls');
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});