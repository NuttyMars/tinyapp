const { assert } = require('chai');

const { generateRandomId, isEmailRegistered } = require('../helpers.js');

const testUsers = {
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
};

describe('generateRandomId', function() {

  it('should generate a string', function() {
    const input = generateRandomId();
    const expected = 'string';

    assert.strictEqual(typeof input, expected);
  });

  it('should have a length of 6', function() {
    const input = generateRandomId();
    const expected = 6;

    assert.strictEqual(input.length, expected);
  });
});

describe('getUserByEmail', function() {

  it('should return a user with valid email', function() {
    const user = isEmailRegistered("user@example.com", testUsers);
    const expectedOutput = "userRandomID";

    assert.strictEqual(user.id, expectedOutput);
  });

  it('should return false when email is not in database', function() {
    const user = isEmailRegistered("user@mymail.com", testUsers);
    const expectedOutput = false;

    assert.deepEqual(user, expectedOutput);
  });
});