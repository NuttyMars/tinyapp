//generates a random string of 6 characters
const generateShortURLid =  function() {
  let id = Math.random().toString(36).substring(2, 8);
  return id;
};

module.exports = { generateShortURLid }