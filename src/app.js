const fs = require("fs");
const App = require("./framework");
const app = new App();
const comments = require("../public/comments.json");
const { createCommentHTML, parseArgs } = require("./util.js");

const getFilePath = function(url) {
  if (url == "/") return "./public/index.html";
  return `./public${url}`;
};

const sendResponse = function(res, content, statusCode = 200) {
  res.statusCode = statusCode;
  res.write(content);
  res.end();
};

const renderGuestBook = function(req, res) {
  fs.readFile("./public/guestBook.html", (err, data) => {
    data += createCommentHTML(comments);
    sendResponse(res, data);
  });
};

const renderMedia = function(req, res) {
  let filePath = getFilePath(req.url);
  fs.readFile(filePath, (err, content) => {
    if (err) return sendResponse(res, "Not Found", 404);
    sendResponse(res, content);
  });
};

const saveComments = function(req, res, content) {
  comments.unshift(parseArgs(content));
  let dataToWrite = JSON.stringify(comments);
  fs.writeFile("./public/comments.json", dataToWrite, err => {
    renderGuestBook(req, res);
  });
};

const readBody = function(req, res) {
  let content = "";
  req.on("data", chunk => {
    content += chunk;
  });
  req.on("end", () => {
    saveComments(req, res, content);
  });
};

app.get("/guestBook.html", renderGuestBook);
app.post("/guestBook.html", readBody);
app.use(renderMedia);
module.exports = app.handleRequest.bind(app);
