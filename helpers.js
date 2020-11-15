const bcrypt = require('bcrypt');

//generates a random string of 6 characters (for short URLs)
const generateRandomId =  function() {
  let id = Math.random().toString(36).substring(2, 8);
  return id;
};

//checks if an email is already in the database
//returns user object if existing, false otherwise
const getUser = function(email, db) {
  for (const key in db) {
    if (db[key].email === email) {
      return db[key];
    }
  }
  return false;
};

//checks that the ID of the user performing an action is the same as the ID in the cookie
//will return boolean
const verifyUserID = function(cookieID, dbEntry) {
  return cookieID === dbEntry;
};

//checks if the password entered matches the one in DB
//returns boolean
const doesPasswordMatch = function(email, password, db) {

  //helper functions - returns user object if existing
  if (getUser(email, db)) {
    for (const key in db) {
      if (bcrypt.compareSync(password, db[key].password)) {
        return true;
      }
    }
  }
  return false;
};

module.exports = { generateRandomId, getUser, verifyUserID, doesPasswordMatch };