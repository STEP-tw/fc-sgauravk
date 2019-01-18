const hideGif = function() {
  let waterJar = document.getElementById("gif");
  waterJar.style.visibility = "hidden";
  setTimeout(() => {
    waterJar.style.visibility = "visible";
  }, 1000);
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

 module.exports = {createTable, arrangeCommentDetails};