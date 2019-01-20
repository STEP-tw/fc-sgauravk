const fs = require("fs");
const App = require("./framework");
const app = new App();
const comments = require("../public/comments.json");
const {createTable, arrangeCommentDetails} = require("./util.js");

const getFilePath = function(url) {
  if (url == "/") {
    return "./public/index.html";
  }
  return `./public${url}`;
};

const sendResponse = function(res, content, statusCode = 200) {
  res.statusCode = statusCode;
  res.write(content);
  res.end();
  return;
};

const renderGuestBook = function(req, res) {
  fs.readFile("./public/guestBook.html", (err, data) => {
    data += createTable(comments);
    sendResponse(res, data);
    return;
  });
};

const renderMedia = function(req, res) {
  let filePath = getFilePath(req.url);
  fs.readFile(filePath, (err, content) => {
    if (err) {
      sendResponse(res, "Not Found", 404);
      return;
    }
    sendResponse(res, content);
  });
  return;
};

extrectCommentsInFile = function(req, res, content) {
  comments.unshift(arrangeCommentDetails(content));
  let dataToWrite = JSON.stringify(comments);
  fs.writeFile("./public/comments.json", dataToWrite, err => {
    renderGuestBook(req, res);
  });
};

const handleFormPost = function(req, res) {
  let content = "";
  req.on("data", chunk => {
    content += chunk;
  });
  req.on("end", () => {
    extrectCommentsInFile(req, res, content);
  });
};

app.get("/guestBook.html", renderGuestBook);
app.post("/guestBook.html", handleFormPost);
app.use(renderMedia);
module.exports = app.handleRequest.bind(app);