function myFunction() {
    var x = document.getElementById("responsiveMenu");
    if (x.className === "desktop") {
      x.className += "responsive";
    } else {
      x.className = "desktop";
    }
  }