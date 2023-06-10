//Global Variables
var diseaseData;
var token;
$(document).ready( function () {
    token = getCookie("token");
    hideAllContent();
    $(document).on('click', 'button.tabledit-add-button', function(){	
        $("#lightBoxColumn").show();
        $('#new_part').val('');
        $('#new_name').val('');
    }); 
    $(document).on('click', '#lightBoxCloseButton', function(){ 
        $("#lightBoxColumn").hide();
    }); 
    $(document).on('click', '#add_newDisease', function(){ 
        addDisease();
    });     
    $(".tabledit-input").keypress(function (evt) {
        //Deterime where our character code is coming from within the event
        var charCode = evt.charCode || evt.keyCode;
        if (charCode  == 13) { //Enter key's keycode
        return false;
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
function addDisease() {
    var r = confirm("確定要新增此筆資料?");
    if (r == true) {
        var new_part = document.getElementById("new_part").value;
        var new_name = document.getElementById("new_name").value;
        $.post({
            url: 'api/updateDisease.php',
            data: JSON.stringify({
                // User
                // account: "admin",
                token: token,
                diseaseID: 0, 
                part: new_part,
                name: new_name, 
            }),      
            success: function (jsonData) { // Callback function when successful
                viewDeletemessage(jsonData); // Call VIEW function 
            },
            fail: function () {
                alert("ERROR: Database connection failed.");
            },
            contentType: "application/json;charset=UTF-8",                  
        })   
    } else {

    }
}
function canEdit(){
    $( ".banned" ).parent().parent().parent().parent().parent().find(".canEdit").hide();
    $( ".banned" ).parent().parent().parent().find(".tabledit-toolbar-column").hide();    
}
function viewDiseaseData(dataIn) {
    diseaseData = dataIn;
	if(diseaseData.code==0){
		alert(diseaseData.msg);
    }else if(diseaseData.code==2){
        alert(diseaseData.msg);
        reLogin();      
	}else{    
		/* Handle !data situation */
	    if (!diseaseData.data.disease) {
	        iLength = 0;
	    } else {
	        iLength = diseaseData.data.disease.length;
	    }			    							
	    for(var i=0;i<iLength;i++){
	    	var trItem = document.createElement("tr");
	    	var tdID = document.createElement("td");
	    	var tdPart = document.createElement("td");
			var tdDisease = document.createElement("td");
			var tdBind = document.createElement("td");
			tdID.innerText = diseaseData.data.disease[i].ID;
            if(diseaseData.data.disease[i].canEdit == false){
                tdID.className = "banned";
            }
	    	tdPart.innerText = diseaseData.data.disease[i].part;
	    	tdDisease.innerText = diseaseData.data.disease[i].name;
		    if (!diseaseData.data.disease[i].bind) {
		        jLength = 0;
		    } else {
		        jLength = diseaseData.data.disease[i].bind.length;
		    }		    	
	    	for(var j=0;j<jLength;j++){  
	    		var tdBindTag = document.createElement("a");
	    		tdBindTag.innerText = diseaseData.data.disease[i].bind[j].departmentName+"("+diseaseData.data.disease[i].bind[j].bindCount+")";
	    		if(j<diseaseData.data.disease[i].bind.length-1){
	    			tdBindTag.innerText = tdBindTag.innerText+" 、 "
	    		}
	    		if(diseaseData.data.disease[i].bind[j].bindCount !=0 ){
	    			tdBindTag.setAttribute("href","page-treatmentprice.html?diseaseID="+diseaseData.data.disease[i].ID+"&page_department="+diseaseData.data.disease[i].bind[j].departmentID);
	    		}
	    		tdBind.appendChild(tdBindTag);
	    	}
	    	trItem.appendChild(tdID);
	    	trItem.appendChild(tdPart);
	    	trItem.appendChild(tdDisease);
	    	trItem.appendChild(tdBind);
	    	document.getElementById('tablebody').appendChild(trItem);
	    }
	}
}    
	
function tableData(){
    $('#tabledit').Tabledit({
        //url: 'api/getDisease.php',
        eventType: 'dblclick',
        editButton: true,
        deleteButton: true,
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
            }
        },
        columns: {
            identifier: [0, 'id'],
            editable: [[1, 'part'],[2, 'disease']]
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
		alert(deleteData.msg);
		location.reload();
	}
}

/* hideAllContent */
function hideAllContent() {
    $("#lightBoxColumn").hide();
    //$(document).on('onLoad', '.detailButtonLink', hide());
}