const fetchComments = function(){
  fetch("/comments.json")
    .then(function(response) {
      return response.text();
    })
    .then(function(data) {
      console.log(JSON.stringify(data));
    });
};