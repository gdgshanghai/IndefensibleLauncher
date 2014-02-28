//alert(1);

var xhr = new XMLHttpRequest();
//xhr.open("GET", "https://www.getpostman.com/collections/c594ef706d94e390f5c3", true);
xhr.open("GET", "http://www.google.com/", true);
xhr.onreadystatechange = function() {
  if (xhr.readyState == 4) {
    // WARNING! Might be injecting a malicious script!
    document.getElementById("resp").innerHTML = xhr.responseText;
  }
}
xhr.send();
