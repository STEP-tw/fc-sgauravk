const fs = require("fs");
const App = require("./framework");
const app = new App();
const comments = require("../public/comments.json");

const getFilePath = function(url) {
  if (url == "/") {
    return "./public/index.html";
  }
  return `./public${url}`;
};

const withTag = function(content, tag) {
  return `<${tag}>${content}</${tag}>`;
};

const withStyleTag = function(content, tag) {
  return `<${tag} width = "500px">${content}</${tag}>`;
};

const createTableRow = function(object) {
  let row = "";
  row = row + withStyleTag(object.time, "td");
  row = row + withStyleTag(object.name, "td");
  row = row + withStyleTag(object.comment, "td");
  return withTag(row, "tr");
};

const createTable = function(list) {
  let table = [];
  let tableHeading = { time: "DATE_TIME", name: "NAME", comment: "COMMENT" };
  table.push(withTag(createTableRow(tableHeading), "th"));
  list.map(element => table.push(createTableRow(element)));
  return withTag(table.join(""), "table");
};

const arrangeCommentDetails = function(details) {
  let time = new Date().toLocaleString();
  let name = details.split("&")[0].split("=")[1];
  name = name.split("+").join(" ")
  let comment = details.split("&")[1].split("=")[1];
  comment = comment.split("+").join(" ")
  return { name, comment, time };
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

app.post("/guestBook.html", handleFormPost);
app.get("/guestBook.html", renderGuestBook);
app.use(renderMedia);
module.exports = app.handleRequest.bind(app);
