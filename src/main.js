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

const createTableRow = function(object){
  let row = "";
  row = row + withTag(object.time, "td");
  row = row + withTag(object.name, "td");
  row = row + withTag(object.comment, "td");
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
  let comment = details.split("&")[1].split("=")[1];
  return { name, comment, time };
 };

 module.exports = {createTable, arrangeCommentDetails};