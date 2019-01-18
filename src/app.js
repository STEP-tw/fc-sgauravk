const fs = require("fs");
const comments = require("./comments.json");
const { createTable, arrangeCommentDetails } = require("./main.js");

const getFiles = function(url) {
  if (url == "/") {
    return "./src/index.html";
  }
  return `.${url}`;
};

const getHtml = function(res) {
  fs.readFile("./src/guestBook.html", (err, data) => {
    data += createTable(comments);
    res.write(data);
    res.end();
  });
  return;
};

const extrectUserComments = function(req) {
  let content = "";
  req.on("data", chunk => {
    content += chunk;
  });
  req.on("end", () => {
    console.log(content);
    comments.unshift(arrangeCommentDetails(content));
    fs.writeFile("./src/comments.json", JSON.stringify(comments), err => {
      return;
    });
  });
};

const app = (req, res) => {
  if (req.url == "/src/guestBook.html" && req.method == "POST") {
    extrectUserComments(req);
    getHtml(res);
    return;
  }
  let filePath = getFiles(req.url);
  fs.readFile(filePath, (err, content) => {
    try {
      res.statusCode = 200;
      res.write(content);
      res.end();
    } catch (err) {
      res.statusCode = 404;
      res.write("Not Found");
      res.end();
    }
  });
};

module.exports = app;
