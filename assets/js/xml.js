/*
Build: 777010
Author: B1akF1Re23, nardoz0918, Rahios
*/

function loadHome() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    document.getElementById("main").innerHTML = this.responseText;
    document.getElementById("title").innerHTML = "HomePage | Nardomen";
    }
  };
  xhttp.open("GET", "home.html", true);
  xhttp.send();
}



function loadAbout() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    document.getElementById("main").innerHTML = this.responseText;
    document.getElementById("title").innerHTML = "About | Nardomen";
    }
  };
  xhttp.open("GET", "about.html", true);
  xhttp.send();
}

function loadContact() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    document.getElementById("main").innerHTML = this.responseText;
    document.getElementById("title").innerHTML = "Contact | Nardomen";
    }
  };
  xhttp.open("GET", "contact.html", true);
  xhttp.send();
}

function loadGallery() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    document.getElementById("main").innerHTML = this.responseText;
    document.getElementById("title").innerHTML = "Gallery | Nardomen";
    }
  };
  xhttp.open("GET", "gallery.html", true);
  xhttp.send();

}


function loadGame() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    document.getElementById("main").innerHTML = this.responseText;
    document.getElementById("title").innerHTML = "Game | Nardomen";
    }
  };
  xhttp.open("GET", "game.html", true);
  xhttp.send();
 
  var s = document.createElement('script');
  s.type = 'text/javascript';
  s.src = "assets/game/js/game.js";
  document.getElementById("main").appendChild(s);
  
}

