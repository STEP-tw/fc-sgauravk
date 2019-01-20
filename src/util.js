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
  let tableHeading = {time: "DATE_TIME", name: "NAME", comment: "COMMENT"};
  table.push(withTag(createTableRow(tableHeading), "th"));
  list.map(element => table.push(createTableRow(element)));
  return withTag(table.join(""), "table");
};

const arrangeCommentDetails = function(details) {
  let time = new Date().toLocaleString();
  let name = details.split("&")[0].split("=")[1];
  let comment = details.split("&")[1].split("=")[1];
  [name, comment] = [name, comment].map(x=> x.split("+").join(" "));
  return { name, comment, time };
};

module.exports = {createTable, arrangeCommentDetails};