var http = require("http");
var url = require("url");
var fs = require("fs");
var path=require("path");
var mime = require("./mime").types;
var config = require("./config");
function onRequest(request, response) {
    var pathname = url.parse(request.url).pathname.toLowerCase();
    var realpath = "public" + pathname;
    var ext = path.extname(pathname);
    ext = ext ? ext.slice(1) : 'unknown';
    if (ext.match(config.Expires.fileMatch)) {
        var expires = new Date();
        expires.setTime(expires.getTime() + config.Expires.maxAge * 1000);
        response.setHeader("Expires", expires.toUTCString());
        response.setHeader("Cache-Control", "max-age=" + config.Expires.maxAge);
    }
    var contentType = mime[ext] || "text/plain";
    console.log("Request for " + realpath + " received.");
    fs.stat(realpath, function (err, stat) {
        var lastModified = stat.mtime.toUTCString();
        response.setHeader("Last-Modified", lastModified);
        if(request.headers["if-modified-since"] && lastModified == request.headers["if-modified-since"]) {
            response.writeHead(304, "Not Modified");
            response.end();
        }else{
            fs.exists(realpath, function (exists) {
                if(!exists) {
                response.writeHead(404, {'Content-Type': 'text/plain'});
                response.write("This request URL " + pathname + " was not found on this server.");
                response.end();
                }else{
                    fs.readFile(realpath, function (err, file) {
                        if (err) {
                            response.writeHead(500, {'Content-Type': 'text/plain'});
                            response.end(err);
                        } else {
                            response.writeHead(200, {'Content-Type': contentType});
                            response.end(file);
                        }
                    });//fs.readFile
                }//exists
            });
        }//request.headers["if-modified-since"] 
    });//fs.stat
}//onrequest
http.createServer(onRequest).listen(8889);
console.log("Server has started.");