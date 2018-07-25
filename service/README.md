# The Web Service

## Details
For this application, I have separated the service that actually 

## Technologies
### Web Service
* ExpressJS [https://github.com/expressjs]

### CORS Support in my service
To support CORS in my service (for browser-based calls into my service), I have implemented the CORS middleware in Express. My default configuration essentially allows any app that can handle the CORS request to handle it.
In order to provide CORS support, the express/cors middleware needs to be configured with the proper origin values. When set correctly, the response header will return with the correct Access-Control-Allow-Origin values. Without it, the XMLHttpRequest was not triggering its onload event. I could see the response come in through the browser's network debugging tab but the XHR wasn't getting the data. 
* Good CORS info here: [https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS]
* Configuring express/cors here: [http://expressjs.com/en/resources/middleware/cors.html]
* CORS middleware for ExpressJS [https://github.com/expressjs/cors]
* * Pre-Flight [https://github.com/expressjs/cors#enabling-cors-pre-flight]