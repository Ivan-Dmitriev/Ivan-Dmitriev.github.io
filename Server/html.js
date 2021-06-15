const http = require("http");
const fs = require('fs').promises;
const { parse } = require('querystring');

const host = 'localhost';
const port = 8000;

let messages = [];

function addNewMessage(user, msg) {
  messages.push({ "User_name": `${user}`, "User_message": `${msg}` );
}

// const requestListener = function (req, res) {
//     if (req.url === "/getMessages")

// }

const requestListener = function (req, res) {
  console.log(
    `Request: ${req.method}, ${req.url}`
  );
  console.log(
    `Request headers: ${JSON.stringify(req.headers)}`
  );

  let fileName;
  let contentType;

  if (req.url === "/") {
    fileName = "index.html";
    contentType = "text/html";
  }
  else if (req.url.endsWith(".css")) {
    fileName = req.url.substr(1);
    contentType = "text/css";
  } else {
    res.writeHead(500);
    res.end("Error, unsupported");
    return;
  }

  fs.readFile(`${__dirname}/${fileName}`)
    .then(contents => {
      res.setHeader("Content-Type", contentType);
      res.writeHead(200);
      res.end(contents);
    })
    .catch(err => {
      res.writeHead(500);
      res.end(err.message);
      return;
    });
};

const server = http.createServer(requestListener);
server.listen(port);

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

async function GetMessage() {
  for (let i = 0; i < messages.length; i++) {
    let single_message = messages[i];
    responce = await fetch(('/getMessage', (req, res) => {
      const elem = document.createElement("p");
      const Textnode = document.createTextNode(`This is a new paragraph. ${single_message.User_name}: ${single_message.User_message}`);
      elem.appendChild(Textnode);
      const My_body = document.getElementById("chat_proccesing");
      elem.appendChild(elem);
    }
  }
}

async function SendMessage() {
  let mes = document.getElementById("mymessage").value;
  let user_name = document.getElementById("myuser_name").value;

  addNewMessage(mes, user_name);

  const url = 'http://localhost:8000/NewMessage';
  const data = { User_name: `${user_name}`, User_message: `${mes}` };

  try {
    const response = await fetch(url, {
      method: 'POST', // или 'PUT'
      body: JSON.stringify(data), // данные могут быть 'строкой' или {объектом}!
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const json = await response.json();
    console.log('Успех:', JSON.stringify(json));
  } catch (error) {
    console.error('Ошибка:', error);
  }
}

