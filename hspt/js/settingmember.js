//Global Variables
var reset_ID;
var delete_ID;
var deleteData;
var resetData;
var saveData;
var addData;
var token;
$(document).ready( function () {
    token = getCookie("token");
    hideAllContent();
    $(document).on('click', 'button.tabledit-add-button', function(){   
        $("#lightBoxColumn").show();
        // $('#warning').val('');
        // $('#new_price').val('');
        showLightBoxDepartmentList();
        showLightBoxRoleList();
    });     
    $(document).on('click', '#lightBoxCloseButton', function(){ 
        $("#lightBoxColumn").hide();
    });     
    $(document).on('click', 'button.showAll', function(){   
        window.location.href = "setting-member.html";
    });  
    $(document).on('click', '#add_newMember', function(){ 
        addNewMember();
    });       
    $(".tabledit-input").keypress(function (evt) {
        //Deterime where our character code is coming from within the event
        var charCode = evt.charCode || evt.keyCode;
        if (charCode  == 13) { //Enter key's keycode
        return false;
        }
    });     

    $(document).on('click', 'button.tabledit-reset-button', function(){ 
        reset_ID = parseInt($(this).parent().parent().parent().parent().attr("id"));
        resetPassword(reset_ID);
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
function addNewMember() {
    var r = confirm("確定要新增此筆資料?");
    if (r == true) {
        var new_name = document.getElementById("new_name").value;
        var new_account = document.getElementById("new_account").value;
        var new_department = parseInt($(document.getElementById('departmentlist')).find('option:selected').val());           
        var new_role = parseInt($(document.getElementById('rolelist')).find('option:selected').val());  
        $.post({
            url: 'api/updateUser.php',
            data: JSON.stringify({
                // User
                // account: "admin",
                token: token,
                ID: "0", 
                userName: new_name,
                userAccount: new_account, 
                departmentID: new_department,
                permissionID: new_role
            }),      
            success: function (jsonData) { // Callback function when successful
                viewAddmessage(jsonData); // Call VIEW function 
            },
            fail: function () {
                alert("ERROR: Database connection failed.");
            },
            contentType: "application/json;charset=UTF-8",                  
        })   
    } else {

    }
}
function viewAddmessage(dataIn) {
    addData = dataIn;
    if(addData.code==0){
        alert(addData.msg);
    }else if(addData.code==2){
        alert(addData.msg);
        reLogin();
    }else{   
        alert("新增成功");
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
function showLightBoxRoleOption(jsonData){
    //console.log('showRole');
    roleData = jsonData;
    if (roleData.code == 2) {
        alert(roleData.msg);
        reLogin();
    }else{
        if (roleData.code == 0) {
            var jLength = 0;      
        } else {
            var jLength = roleData.data.length;
        }               
        for(var j=1;j<jLength;j++){ 
            var optionItem  = document.createElement("option");
            optionItem.innerText = roleData.data[j].name;
            optionItem.setAttribute("value", roleData.data[j].ID);
            document.getElementById('rolelist').appendChild(optionItem);                    
        }        
    }
}
function showLightBoxRoleList(){
    $("#rolelist option[value!= 0]").remove();
    $.post({
        url: "api/getPermission.php",
        data: JSON.stringify({
            // account: "admin"
            token: token       
        }),                
        success: function (jsonData) {
            showLightBoxRoleOption(jsonData); 
        },
        fail: function () {
            alert("ERROR at askDBData: Database connection failed.");
        },
        contentType: "application/json;charset=UTF-8",
    }); 
}
function showLightBoxDepartmentList(){
    $("#departmentlist option[value!= 0]").remove();
    $.post({
        url: "api/comboDepartment.php",
        data: JSON.stringify({
            token: token
        }),         
        success: function (jsonData) {
            showLightBoxListOption(jsonData); 
        },
        fail: function () {
            alert("ERROR at askDBData: Database connection failed.");
        },
        contentType: "application/json;charset=UTF-8",
    }); 
}
function showLightBoxListOption(jsonData){
    //console.log('showList');
    comboData1 = jsonData;
    if (comboData.code == 2) {
        alert(comboData.msg);
        reLogin();
    }else{
        if (comboData.code == 0) {
            var jLength = 0;      
        } else {
            var jLength = comboData.data.department.length;
        }               
        for(var j=0;j<jLength;j++){ 
            var optionItem  = document.createElement("option");
            optionItem.innerText = comboData.data.department[j].name;
            optionItem.setAttribute("value", comboData.data.department[j].ID);
            document.getElementById('departmentlist').appendChild(optionItem);
        }        
    }
}

function resetPassword(reset_ID){
    var r = confirm("確定要重設密碼?");
    if (r == true) {
        $.post({
            url: 'api/resetPassword.php',
            data: JSON.stringify({
                // account: "admin",
                token: token,
                ID: reset_ID
            }),      
            success: function (jsonData) {
                viewmessage(jsonData);
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
    resetData = dataIn;
    if(resetData.code==0){
        alert(resetData.msg);
    }else if(resetData.code==2){
        alert(resetData.msg);
        reLogin();
    }else{   
        alert("重設成功");
        location.reload();
    }
}

function canEdit(){
    $( ".banned" ).parent().parent().parent().parent().parent().find(".canEdit").hide();
    $( ".banned" ).parent().parent().parent().find(".tabledit-toolbar-column").hide();    
}

function viewUserData(dataIn) {
    userData = dataIn;
    if(userData.code==0){
        alert(userData.msg);
    }else if(userData.code==2){
        alert(userData.msg);
        reLogin();
    }else{
        if (!userData.data) {
            iLength = 0;
        } else {
            iLength = userData.data.length;
        }                                           
        for(var i = 1;i<iLength;i++){
            var trItem = document.createElement("tr");
            var tdId = document.createElement("td");
            var tdname = document.createElement("td");
            var tdDepartment = document.createElement("td");
            var tdRole = document.createElement("td");

            tdId.innerText = userData.data[i].ID;
            tdname.innerText = userData.data[i].userName;
            tdDepartment.innerText = userData.data[i].departmentName;            
            tdRole.innerText = userData.data[i].permissionName;

            //將使用者帳號存在username裡面
            tdname.className = userData.data[i].userAccount;

            trItem.appendChild(tdId);
            trItem.appendChild(tdname);
            trItem.appendChild(tdDepartment);
            trItem.appendChild(tdRole);           
            document.getElementById('tablebody').appendChild(trItem);
        }
   	}
}

function tableData(){
    //console.log('tableData');
    $('#tabledit').Tabledit({
        eventType: 'dblclick',
        editButton: true,
        deleteButton: true,
        resetButton: true,        
        hideIdentifier: false,
        buttons: {
            edit: {
                class: 'btn btn-sm btn-warning',
                html: '<span class="glyphicon glyphicon-pencil"></span> Edit',
                action: 'edit'
            },
            delete: {
                class: 'btn btn-sm btn-danger',
                html: '<span class="glyphicon glyphicon-trash"></span> Trash',
                action: 'delete'
            },
            save: {
                class: 'btn btn-sm btn-success',
                html: 'Save'
            },
            restore: {
                class: 'btn btn-sm btn-warning',
                html: 'Restore',
                action: 'restore'
            },
            confirm: {
                class: 'btn btn-sm btn-default',
                html: 'Confirm'
            },
            reset: {
                class: 'btn btn-sm btn-primary',
                html: '<span class="glyphicon glyphicon-cog"></span> Reset Password',
                action: 'reset'
            }                   
        },
        columns: {
            identifier: [0, 'id'],
            editable: [[2, 'department', JSON.stringify(jsonDepartmentObj2)],[3, 'role', JSON.stringify(jsonRoleObj)]]
        },
        onSuccess: function(data, textStatus, jqXHR) {
            viewData()
        },
        onFail: function(jqXHR, textStatus, errorThrown) {
            // console.log('onFail(jqXHR, textStatus, errorThrown)');
            // console.log(jqXHR);
            // console.log(textStatus);
            // console.log(errorThrown);
        },
        onAjax: function(action, serialize) {
            // console.log('onAjax(action, serialize)');
            // console.log(action);
            // console.log(serialize);
        }
    });
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
function viewDeletemessage(dataIn) {
    deleteData = dataIn;
	if(deleteData.code==0){
		alert(deleteData.msg);
    }else if(deleteData.code==2){
        alert(deleteData.msg);
        reLogin();        
	}else{   
		alert("刪除成功");
		location.reload();
	}
}

function viewSavemessage(dataIn) {
    saveData = dataIn;
    if(saveData.code==0){
        alert(saveData.msg);
    }else if(saveData.code==2){
        alert(saveData.msg);
        reLogin();          
    }else{   
        alert("修改成功");
        location.reload();
    }
}

/* hideAllContent */
function hideAllContent() {
    $("#lightBoxColumn").hide();
}