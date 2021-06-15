const http = require("http");
const fs = require('fs').promises;
const { parse } = require('querystring');

const host = 'localhost';
const port = '8000';

let all_messages_array = [];
let NumOfMessages = 0;
let current_message = 0;
var Num = 0;

// const requestListener = function (req, res) {
//     if (req.url === "/getmessages_array")
// }

const requestListener = function (req, res) {
  console.log(
    `Request: ${req.method}, ${req.url}`
  );
  /*
  console.log(
    `Request headers: ${JSON.stringify(req.headers)}`
  );  
  */

  let IsMessage = false;
  let Num = 0;
  let fileName;
  let contentType;

  if (req.url === "/") {
    fileName = "index.html";
    contentType = "text/html";
  }
  else if (req.url === "/newMessage") {
    IsMessage = true;
    res.writeHead(200);
    let data = "";
    req.on('data', (chunk) => {
      data += chunk.toString();
    })
    req.on('end', () => {
      console.log(`Reseived message: ${data}`);
      if (data !== "") {
        Message = data;
        all_messages_array[Num++] = data;
      }
      res.end();
    })
    console.log(
      `Request headers: ${JSON.stringify(req.headers)}`
    );
    return;
  }
  else if (req.url === "/getMessage") {
    IsMessage = true;
    res.writeHead(200);
    res.end(JSON.stringify(all_messages_array));
    console.log("Getting messages_array from user...");
  }
  else if (req.url.endsWith(".css")) {
    fileName = req.url.substr(1);
    contentType = "text/css";
  } else {
    res.writeHead(500);
    res.end("Error, unsupported");
    return;
  }

  if (!IsMessage)
    fs.readFile(`${__dirname}/${fileName}`)
      .then(contents => {
        res.setHeader("Content-Type", contentType);
        res.writeHead(200);
        res.end(contents.toString());
      })
      .catch(err => {
        res.writeHead(500);
        res.end(err.message);
        return;
      });
};

const server = http.createServer(requestListener);
server.listen(port);


