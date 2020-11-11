//generates a random string of 6 characters
const generateRandomString =  function() {
  let id = Math.random().toString(36).substring(2, 8);
  return id;
};

module.exports = { generateRandomString }