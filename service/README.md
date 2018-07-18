# The Web Service

## Details
* In order to provide CORS support, I set the 'Access-Control-Allow-Origin' response header. Without it, the XMLHttpRequest was not triggering its onload event. I could see the response come in through the browser's network debugging tab but the XHR wasn't getting the data.

## Technologies
* ExpressJS [https://github.com/expressjs]
* CORS middleware for ExpressJS [https://github.com/expressjs/cors]
* * Pre-Flight [https://github.com/expressjs/cors#enabling-cors-pre-flight]