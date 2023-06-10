/* JS: login */
globals: $:false; // Ignore JSLint/JSHint error: "$ is not defined"

$(document).ready(function(){
  // $(document).on('click', 'input#login', askLogin); // loginButton CLICK
});

/* API: date data */
function askLogin() {
  var username = $("#username").val();
  var password = $("#password").val();
  $.ajax({
    async:false,
    url: "api/login.php",
    type:"POST",
    data: JSON.stringify({
        // User
        account: username,
        password: password       
    }),
    contentType: "application/json;charset=UTF-8",
    dataType: "json",
    success: function (jsonData) { // Callback function when successful
        viewMessage(jsonData); // Call VIEW function 
    },
    fail: function () {
        alert("ERROR: Database connection failed.");
    },
  }); // End of ajax call

  // $.post({
  //     url: "api/login.php", // URL of API
  //     data: JSON.stringify({
  //         // User
  //         account: username,
  //         password: password       
  //     }),

  //     success: function (jsonData) { // Callback function when successful
  //         viewMessage(jsonData); // Call VIEW function 
  //     },
  //     fail: function () {
  //         alert("ERROR: Database connection failed.");
  //     },
  //     contentType: "application/json;charset=UTF-8",    
  // });
}

function viewMessage(dataIn) {
    deleteData = dataIn;
    if(deleteData.code==0){
        alert(deleteData.msg);
        window.location.href = "login.html";
    }else{   
        alert("登入成功");
        document.cookie = "token=" + deleteData.data+ ";path=/";
        window.location.href = "index.html";
    }
}







