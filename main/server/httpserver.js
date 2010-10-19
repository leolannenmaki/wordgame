var sys = require('sys'),
    fs = require('fs'),
    http = require('http')
    path = require('path');
    
// load client-side html and javascript files into memory
var html = fs.readFileSync(path.normalize(__dirname + '/../../build/client.html')),
    jquery = fs.readFileSync(path.normalize(__dirname + '/../../build/jquery.js')),
    clientSide = fs.readFileSync(path.normalize(__dirname + '/../../build/wordgame-latest.js')),
    dnode = require('dnode/web').source();


// simple http server to serve pages
var httpServer = http.createServer(function (req,res) {
    if (req.url == '/dnode.js') {
        res.writeHead(200, { 'Content-Type' : 'text/javascript' });
        res.end(dnode);
    } else if (req.url == '/jquery.js') {
        res.writeHead(200, { 'Content-Type' : 'text/javascript' });
        res.end(jquery);
    } else if (req.url == '/client.js') {
        res.writeHead(200, { 'Content-Type' : 'text/javascript' });
        res.end(clientSide);
    } else {
        res.writeHead(200, { 'Content-Type' : 'text/html' });
        res.end(html);
    }
});
exports.httpServer = httpServer;
