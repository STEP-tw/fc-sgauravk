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
    res.write(data);
    res.statusCode = 200;
    res.end();
  });
};

module.exports = app;
