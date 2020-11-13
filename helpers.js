//generates a random string of 6 characters (for short URLs)
const generateRandomId =  function() {
  let id = Math.random().toString(36).substring(2, 8);
  return id;
};

//checks if an email is already in the database
//returns user object if existing, false otherwise
const isEmailRegistered = function(email, db) {
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

module.exports = { generateRandomId, isEmailRegistered, verifyUserID };