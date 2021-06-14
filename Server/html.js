const http = require('http');
const { parse } = require('querystring');
const fs = require('fs').promises;

const requestListener = function (req, res) {
  if (req.method === 'POST') {
    collectRequestData(req, result => {
      console.log(result);
      res.end(`Parsed data belonging to ${result.fname}`);
    });
  }
  else {
    fs.readFile(__dirname + "/index.html")
      .then(contents => {
        res.setHeader("Content-Type", "text/html");
        res.writeHead(200);
        res.end(contents);
      })
  }
};

const server = http.createServer(requestListener);
server.listen(8000);

function collectRequestData(request, callback) {
  const FORM_URLENCODED = 'application/x-www-form-urlencoded';
  if (request.headers['content-type'] === FORM_URLENCODED) {
    let body = '';
    request.on('data', chunk => {
      body += chunk.toString();
    });
    request.on('end', () => {
      callback(parse(body));
    });
  }
  else {
    callback(null);
  }
}