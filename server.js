'use strict';

var http = http || require('http'),
    fs = fs || require('fs'),
    fileserv = fileserv || require('./file');

http.createServer(onRequest).listen(8080);

console.log('Server started...');

function onRequest (req, resp) {
  console.log('Request received. Type: ', req.method, ', path: ', req.url);

  var file_prm = fileserv.get(req.url, resp);

  Promise.all(file_prm)
    .then(function(){
        resp.end();
    })
    .catch(function(err) {

        console.log('Final Promise. ', err);

        resp.statusCode = 200;
        resp.setHeader('Content-Type', 'application/json');
        // Note: the 2 lines above could be replaced with this next one:
        // response.writeHead(200, {'Content-Type': 'application/json'})
        resp.write("Hello World");
        resp.end();
    });
}