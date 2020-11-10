const express = require('express');
const bodyParser = require("body-parser");

const app = express();
const PORT = 8080; // default port 8080

// set the view engine to ejs
app.set('view engine', 'ejs');
// this is to be able to use the body-parser
app.use(bodyParser.urlencoded({extended: true}));

const urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com'
};

//generates a random string of 6 characters
const generateRandomString =  function() {
  let id = Math.random().toString(36).substring(2, 8);
  return id;
};

//registers a handler on the root path
app.get('/', (req, res) => {
  console.log('/');

  //res.send() will work for simple text
  //for more complex page rendering, we use ejs
  res.send('Hello!');
});

//EJS knows where to look for the file, so no need to specify the views path
//EJS also knows it will deal with ejs templates, so no need to specify extension
//handles /urls route that shows a table of shortened URLs
app.get('/urls', (req, res) => {
  const templateVars = { urls: urlDatabase };

  console.log('/urls get');
  res.render('urls_index', templateVars);
});

//this will return a req.body in the form of an object {longURL: value input}
//it knows to do this because of the form formatting in urls_new
//the nody is originally a JSON string, but it gets parsed with body-parser
app.post("/urls", (req, res) => {
  const newURL = req.body.longURL;
  let newURLid = generateRandomString();

  urlDatabase[newURLid] = newURL;

  console.log('/urls post');
  //console.log(req.body.longURL); <-- this comes from the form label in urls_new
  res.redirect(`urls/${newURLid}`);
});

//handles the path where new URLs are submitted to be shortened
app.get("/urls/new", (req, res) => {
  console.log("/urls/new");
  //onsole.log(req.params); <-- empty
  res.render("urls_new");
});

//handles specific short URL routes that show only one shortened link
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };

  console.log("/urls/new");
  res.render("urls_show", templateVars);
});

//this handles the input coming from the update form
app.post("/urls/:shortURL", (req, res) => {
  //this is coming from our URL
  const shortURL = req.params.shortURL;
  //this is coming from urls_show
  const newURL = req.body.longURL;

  urlDatabase[shortURL] = newURL;

  res.redirect(`/urls/${shortURL}`);
})


//this will redirect the user from the shortened URL to the original one
app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];

  if (!longURL.includes('http://')) {
    longURL = 'http://' + longURL;
  }
  
  console.log("/u/:shortURL",);
  res.redirect(longURL);
});

//this will allow the user to delete a shortened URL and redirect to urls_index
app.post('/urls/:shortURL/delete', (req, res) => {
  const shortURL = req.params.shortURL;
  console.log('/urls/:shortURL/delete', shortURL);
  
  delete urlDatabase[shortURL];
  res.redirect('/urls');
});


//handles the /urls.json route - gives a json of the database
app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

//handles the /hello route - the HTML will be rendered inside the browser
app.get('/hello', (req, res) => {
  res.send('<html><body>Hello <b>World</b></body></html>\n');
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});