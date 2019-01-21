const fetchComments = function(){
  fetch("/html_pages/guestBook.html")
    .then(function(response) {
      return response.text();
    })
    .then(function(data) {
      let content = document.createElement("html");
      let table = document.getElementById("commentBox");
      content.innerHTML = data;
      table.innerHTML = content.getElementsByClassName("table")[0].innerHTML;
    });
};