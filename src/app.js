const fs = require("fs");
const comments = require("../public/comments.json");

const getFiles = function(url) {
  if (url == "/") {
    return "./public/index.html";
  }
  return `.${url}`;
};

const withTag = function(content, tag){
  return `<${tag}>${content}</${tag}>`
}

const withStyleTag = function(content, tag){
  return `<${tag} width = "500px">${content}</${tag}>`
}

const createTableRow = function(object){
  let row = "";
  row = row + withStyleTag(object.time, "td");
  row = row + withStyleTag(object.name, "td");
  row = row + withStyleTag(object.comment, "td");
  return withTag(row, "tr");
};

const createTable = function(list){
  let table = [];
  let tableHeading = {time: "DATE_TIME", name: "NAME", comment: "COMMENT"};
  let firstLine = withTag(createTableRow(tableHeading), "th");
  table.push(firstLine);
  list.map(element => table.push(createTableRow(element)));
  return table.join("");
}

const arrangeCommentDetails = function(details) {
  let time = new Date().toLocaleString();
  let name = details.split("&")[0].split("=")[1];
  name = name.split("+").join(" ");
  let comment = details.split("&")[1].split("=")[1];
  comment = comment.split("+").join(" ");
  return { name, comment, time };
 };

const getHtml = function(res) {
  fs.readFile("./public/guestBook.html", (err, data) => {
    let table = createTable(comments);
    data += "<table>" + table + "</table>";
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
    comments.unshift(arrangeCommentDetails(content));
    fs.writeFile("./public/comments.json", JSON.stringify(comments), err => {
      return;
    });
  });
};

const handleRequest = function(req, res){
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
}

const app = (req, res) => {
  if (req.url == "/public/guestBook.html" && req.method == "POST") {
    extrectUserComments(req);
    getHtml(res);
    return;
  }
  if (req.url == "/public/guestBook.html" && req.method == "GET"){
    getHtml(res);
    return;
  }
  handleRequest(req, res);
};

module.exports = app;
