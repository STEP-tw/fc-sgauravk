const hideGif = function() {
  let waterJar = document.getElementById("gif");
  waterJar.style.visibility = "hidden";
  setTimeout(() => {
    waterJar.style.visibility = "visible";
  }, 1000);
};
