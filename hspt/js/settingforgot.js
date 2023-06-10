//Global Variables
var old_password;
var new_password;
var token;
$(document).ready( function () {
    token = getCookie("token");
    $(document).on('click', 'button#reset', function(){
        old_password = document.getElementById("oldpassword").value;
        new_password = document.getElementById("newpassword").value;
        if(old_password.length != 0 && new_password.length != 0){
            sendDataToAPI();
        }else{
            alert("請輸入原/新密碼");
        }        	
    }); 
    $(document).on('click', '#logoutNav', function(){ 
        var r = confirm("確定要登出?");
        if (r == true) {
            document.cookie = "token="+token+"; expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/";
            // window.location.href = "login.html";
            $(location).attr('href', 'login.html');
            return true;
        } else {
            return false;
        }
    });          
} );
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
//API呼叫函數： resetPassword.php
function sendDataToAPI(){
    var r = confirm("確定要修改密碼?");
    if (r == true) {
        $.post({
            async:false,
            url: 'api/resetPassword.php',
            data: JSON.stringify({
                token: token,
                ID: 1, 
                oldPassword: old_password,
                newPassword: new_password, 
            }),      
            success: function (jsonData) { // Callback function when successful
                viewmessage(jsonData); // Call VIEW function 
            },
            fail: function () {
                alert("ERROR: Database connection failed.");
            },
            contentType: "application/json;charset=UTF-8",                  
        })   
    } else {

    }
}

function viewmessage(dataIn) {
    deleteData = dataIn;
    if(deleteData.code==0){
        alert(deleteData.msg);
    }else if(deleteData.code==2){
        alert(deleteData.msg);
        reLogin();
    }else{   
        alert("修改成功");
        location.reload();
    }
}
function viewLoginMessage(dataIn) {
    deleteData = dataIn;
    if(deleteData.code==0){
        alert(deleteData.msg);
        window.location.href = "login.html";
    }else{   
        alert("登入成功");
        document.cookie = "token=" + deleteData.data+ ";path=/";
        token = getCookie("token");
    } 
}

function reLogin() {
    var username = prompt("請輸入帳號", "username");
    var password = prompt("請輸入密碼", "password");
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
            viewLoginMessage(jsonData); // Call VIEW function 
        },
        fail: function () {
            alert("ERROR: Database connection failed.");
        },
    });
}