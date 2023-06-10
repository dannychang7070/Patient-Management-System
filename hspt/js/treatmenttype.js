//Global Variables
var treatmentTypeData;
var token;
$(document).ready( function () {
    token = getCookie("token");
    hideAllContent();
    $(document).on('click', 'button.tabledit-add-button', function(){	
        $("#lightBoxColumn").show();
        $('#new_treatmentType').val('');
    }); 
    $(document).on('click', '#lightBoxCloseButton', function(){ 
        $("#lightBoxColumn").hide();
    }); 
    $(document).on('click', '#add_newTreatmentType', function(){ 
        addTreatmentType();
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
function addTreatmentType() {
    var r = confirm("確定要新增此筆資料?");
    if (r == true) {
        var new_treatmentType = document.getElementById("new_treatmentType").value;
        $.post({
            url: 'api/updateTreatmentType.php',
            data: JSON.stringify({
                // User
                // account: "admin",
                token: token,
                treatmentTypeID: 0, 
                name: new_treatmentType
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
function viewTreatmentTypeData(dataIn) {
    treatmentTypeData = dataIn;
	if(treatmentTypeData.code==0){
		alert(treatmentTypeData.msg);
    }else if(treatmentTypeData.code==2){
        alert(treatmentTypeData.msg);
        reLogin();
	}else{    
		/* Handle !data situation */
	    if (!treatmentTypeData.data.treatmentType) {
	        iLength = 0;
	    } else {
	        iLength = treatmentTypeData.data.treatmentType.length;
	    }			    							
	    for(var i=0;i<iLength;i++){
	    	var trItem = document.createElement("tr");
	    	var tdID = document.createElement("td");
	    	var tdType = document.createElement("td");
			var tdBind = document.createElement("td");
			tdID.innerText = treatmentTypeData.data.treatmentType[i].ID;
	    	tdType.innerText = treatmentTypeData.data.treatmentType[i].name;
            if(treatmentTypeData.data.treatmentType[i].canEdit == false){
                tdID.className = "banned";
            }
		    if (!treatmentTypeData.data.treatmentType[i].bind) {
		        jLength = 0;
		    } else {
		        jLength = treatmentTypeData.data.treatmentType[i].bind.length;
		    }		    	
	    	for(var j=0;j<jLength;j++){  
	    		var tdBindTag = document.createElement("a");
	    		tdBindTag.innerText = treatmentTypeData.data.treatmentType[i].bind[j].departmentName+"("+treatmentTypeData.data.treatmentType[i].bind[j].bindCount+")";
	    		if(j<treatmentTypeData.data.treatmentType[i].bind.length-1){
	    			tdBindTag.innerText = tdBindTag.innerText+" 、 "
	    		}
	    		if(treatmentTypeData.data.treatmentType[i].bind[j].bindCount !=0 ){
	    			tdBindTag.setAttribute("href","page-treatmentprice.html?treatmentTypeID="+treatmentTypeData.data.treatmentType[i].ID+"&page_department="+treatmentTypeData.data.treatmentType[i].bind[j].departmentID);
	    		}
	    		tdBind.appendChild(tdBindTag);
	    	}
	    	trItem.appendChild(tdID);
	    	trItem.appendChild(tdType);
	    	trItem.appendChild(tdBind);
	    	document.getElementById('tablebody').appendChild(trItem);
	    }
	}
}    
	
function tableData(){
    $('#tabledit').Tabledit({
        // url: 'api/getTreatmentType.php',
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
            editable: [[1, 'type']]
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