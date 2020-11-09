const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//registers a handler on the root path
app.get("/", (req, res) => {
  res.send("Hello!");
});

//handles the /urls.json route - gives a json of the database
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//handles the /hello route - the HTML will be rendered inside the browser
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// //this sets a value for a
// // route /set will therefore print a = 1
// app.get("/set", (req, res) => {
//   const a = 1;
//   res.send(`a = ${a}`);
// });

// //this will result in a reference error because a was defined outside scope
// // route /fetch will therefore print the whole error body
// app.get("/fetch", (req, res) => {
//   res.send(`a = ${a}`);
// });

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});