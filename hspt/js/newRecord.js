/* JS: newRecord */

globals: $:false; // Ignore JSLint/JSHint error: "$ is not defined"
var token;
$(document).ready(function () {
    //getUser(); // Get user ID and request
    askDBData(); // Ask for data from DB
    token = getCookie("token");
});
function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
/* Communicate with API (AJAX) */
function askDBData() {
    /* Request from the user */
    var userRequest = {
        token: token
        // account:"admin",
        // password:"hspt",
        //password:document.getElementById('txt_password').value
    }

    /* Transform to JSON format */
    var jsonRequest = JSON.stringify(userRequest);

    /* Connect to API */
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "api/getTherapist.php", !0); // Location of API
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(jsonRequest);
    xhr.onreadystatechange = function () {
        //alert("200"); // DEBUG: Show 200 if successful
        if (xhr.readyState === 4 && xhr.status === 200) {
            var jsonData = JSON.parse(xhr.responseText); // Analyse the JSON data returned
            showDBData(jsonData); // Execute VIEW function
        }
    }
}