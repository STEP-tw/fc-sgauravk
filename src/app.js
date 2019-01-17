const fs = require("fs");

const getFiles = function(url) {
  if (url == "/") {
    return "./src/index.html";
  }
  return `.${url}`;
};

const app = (req, res) => {
  let file = getFiles(req.url);
  fs.readFile(file, (err, data) => {
    try {
      res.write(data);
      res.statusCode = 200;
      res.end();
    } catch (err) {
      res.write("Not Found");
      res.statusCode = 404;
      res.end();
    }
  });
};

module.exports = app;
