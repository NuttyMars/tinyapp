DONE:
GET / - if user is not logged in: (Minor) redirect to /login -> user stays on / instead with "Hello!"

CURRENT:

GET /urls/:id - if user is not logged in / if user is logged it but does not own the URL with the given ID - returns HTML with a relevant error message -> any user is able to access this page

NEXT:
GET /urls/:id & GET /u/:id - if a URL for the given ID does not exist: (Minor) returns HTML with a relevant error message -> user gets the error that express throws out
POST /urls - if user is not logged in: (Minor) returns HTML with a relevant error message -> unauthenticated users are able to post to this route with no error message

verifyUserID - this function just takes two arguments and returns a true/false if they match so this isn't overkill per say, its only value is that it documents by virtue of its name why you want to compare two things but you don't really need this. A more appropriate use for this would be if it just takes in the userId and shortUrl and within the function itself it looks up the corresponding userId of the shortURL

be careful around some of the names for you functions as it serves a shorthand label/comment of sorts: isEmailRegistered -> based on this name I would expect it to return true or false. However it actually returns a user object if it finds one. getUser would be more appropriate and you can set up whatever is using the returned user object to handle undefined

doesPasswordmatch, urlsForUser can be moved to the helper file as well