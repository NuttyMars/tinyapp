const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

// set the view engine to ejs
app.set('view engine', 'ejs');

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//registers a handler on the root path
app.get("/", (req, res) => {

  //this will work for simple text
  res.send("Hello!");

  //for more complex page rendering, we use ejs
  //res.render('pages/index');
});

//handles the /urls.json route - gives a json of the database
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//handles the /hello route - the HTML will be rendered inside the browser
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});