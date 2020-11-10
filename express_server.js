const express = require('express');
const app = express();
const PORT = 8080; // default port 8080

// set the view engine to ejs
app.set('view engine', 'ejs');

const urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com'
};

//registers a handler on the root path
app.get('/', (req, res) => {

  //this will work for simple text
  //for more complex page rendering, we use ejs
  res.send('Hello!');
});

//EJS knows where to look for the file, so no need to specify the views path
//EJS also knows it will deal with ejs templates, so no need to specify extension
//handles /urls route that shows a table of shortened URLs
app.get('/urls', (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render('urls_index', templateVars);
});

//handles specific short URL routes that show only one shortened link
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
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