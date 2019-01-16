const fs = require("fs");

const app = (req, res) => {
  let allFiles = [
    "/src/images/freshorigins.jpg",
    "/src/images/animated-flower-image-0021.gif",
    "/src/main.css",
    "/src/main.js"
  ];
  if (req.url == "/") {
    fs.readFile("./src/index.html", "utf8", (err, data) => {
      res.write(data);
      res.statusCode = 200;
      res.end();
    });
  }
  if (allFiles.includes(req.url)) {
    fs.readFile(`.${req.url}`, (err, data) => {
      res.write(data);
      res.statusCode = 200;
      res.end();
    });
  }
};

module.exports = app;