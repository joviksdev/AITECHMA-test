const http = require('http');
const fs = require('fs');
const path = require('path');
const registration = require('./registration');
const checkdetail = require('./checkdetail');

http
  .createServer(function(req, res) {
    const path_name = `.${req.url}`;
    const extname = String(path.extname(path_name)).toLowerCase();

    const mimeTypes = {
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.css': 'text/css',
      '.json': 'application/json'
    };

    fs.readFile(path_name, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.write('404 Not found');
        res.end();
      } else {
        if (req.method === 'GET') {
          res.writeHead(200, {
            'Content-Type': mimeTypes[extname]
          });
          res.write(data);
          res.end();
        } else if (req.method === 'POST' && path_name === './registration.js') {
          registration(req, res, mimeTypes[extname]);
        } else if (req.method === 'POST' && path_name === './checkdetail.js') {
          checkdetail(req, res, mimeTypes[extname]);
        }
      }
    });
  })
  .listen(3000);

console.log('Server running');
