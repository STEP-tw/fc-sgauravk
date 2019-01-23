const fs = require("fs");
const App = require("./framework");
const loginLogout = require("../public/scripts/loginLogoutView");
const app = new App();
const comments = require("../private/comments.json");
const { createCommentHTML, parseArgs } = require("./util.js");

const getFilePath = function(url) {
  if (url == "/") return "./public/html_pages/index.html";
  return `./public${url}`;
};

const sendResponse = function(res, content, statusCode = 200) {
  res.statusCode = statusCode;
  res.write(content);
  res.end();
};

const checkCookie = function(req, res, guestBook) {
  let content = guestBook.replace("##FORMHERE##", loginLogout.afterLogin);
  sendResponse(res, content.replace("##USER##", req.cookies.username));
};

const renderGuestBook = function(req, res) {
  fs.readFile("./public/html_pages/guestBook.html", "utf-8", (err, data) => {
    let guestBook = data.replace("##COMMENTS##", createCommentHTML(comments));
    if (req.cookies.username) return checkCookie(req, res, guestBook);
    let modifiedGuestBook = guestBook.replace(
      "##FORMHERE##",
      loginLogout.beforeLogin
    );
    sendResponse(res, modifiedGuestBook);
    return;
  });
};

const sendError = function(res) {
  let content = `<html style="background-image: url(https://bit.ly/2Td4raY);
    background-size: cover;"></html>`;
  return sendResponse(res, content, 404);
};

const renderMedia = function(req, res) {
  let filePath = getFilePath(req.url);
  fs.readFile(filePath, (err, content) => {
    if (err) return sendError(res);
    sendResponse(res, content);
  });
};

const saveComments = function(req, res, content) {
  let userDetails = "username=" + req.cookies.username + "&" + content;
  comments.unshift(parseArgs(userDetails));
  let dataToWrite = JSON.stringify(comments);
  fs.writeFile("./private/comments.json", dataToWrite, err => {
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

const extrectName = function(cookie, cookies) {
  cookie.split(";").forEach(element => {
    let [name, value] = element.split("=");
    cookies[name] = value;
  });
};

const readCookies = function(req, res, next) {
  let cookie = req.headers["cookie"];
  let cookies = {};
  if (cookie) extrectName(cookie, cookies);
  req.cookies = cookies;
  next();
};

const login = function(req, res) {
  let content = "";
  req.on("data", chunk => (content += chunk));
  req.on("end", () => {
    let username = content.split("=")[1];
    res.setHeader("Set-Cookie", "username=" + username);
    res.writeHead(302, {
      Location: "/html_pages/guestBook.html"
    });
    res.end();
  });
};

const logout = function(req, res, next) {
  res.setHeader(
    "Set-Cookie",
    "username=;expires=Thu, 01 Jan 1970 00:00:00 UTC"
  );
  res.writeHead(302, {
    Location: "/html_pages/guestBook.html"
  });
  res.end();
};

app.use(readCookies);
app.get("/html_pages/guestBook.html", renderGuestBook);
app.post("/login", login);
app.post("/logout", logout);
app.post("/html_pages/submitComment", readBody);
app.use(renderMedia);
module.exports = app.handleRequest.bind(app);
