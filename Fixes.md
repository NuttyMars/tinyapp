DONE:
GET / - if user is not logged in: (Minor) redirect to /login -> user stays on / instead with "Hello!"
GET /urls/:id - if user is not logged in / if user is logged it but does not own the URL with the given ID - returns HTML with a relevant error message -> any user is able to access this page
GET /urls/:id & GET /u/:id - if a URL for the given ID does not exist: (Minor) returns HTML with a relevant error message -> user gets the error that express throws out

doesPasswordmatch, urlsForUser can be moved to the helper file as well - doesPasswordmatch done

isEmailRegistered -> based on this name I would expect it to return true or false. However it actually returns a user object if it finds one. getUser would be more appropriate

NOT DONE:

POST /urls - if user is not logged in: (Minor) returns HTML with a relevant error message -> unauthenticated users are able to post to this route with no error message - was not able to replicate

doesPasswordmatch, urlsForUser can be moved to the helper file as well - could not find a way to import database
