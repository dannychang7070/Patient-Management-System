//Global Variables
var treatmentData;
var jsonObj = {};
var token;

$(document).ready( function () {
    token = getCookie("token");
    hideAllContent();
    $(document).on('click', 'button.tabledit-add-button', function(){	
        $("#lightBoxColumn").show();
        $('#new_disease').val('');
        showTreatmentTypeList();
    }); 
    $(document).on('click', '#lightBoxCloseButton', function(){ 
        $("#lightBoxColumn").hide();
    }); 
    $(document).on('click', '#add_newTreatment', function(){ 
        addTreatment();
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
function addTreatment() {
    var r = confirm("確定要新增此筆資料?");
    if (r == true) {
        var new_treatmentType = $(document.getElementById('treatmenttypelist')).find('option:selected').val();
        var new_disease = document.getElementById("new_disease").value;
        $.post({
            url: 'api/updateTreatment.php',
            data: JSON.stringify({
                // User
                // account: "admin",
                token: token,
                treatmentID: 0,
                name: new_disease,               
                treatmentTypeID: new_treatmentType, 
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

function showTreatmentTypeList(){
    $("#treatmenttypelist option[value!= 0]").remove();
    if (!treatmentData.data.treatmentType) {
        jLength = 0;
    } else {
        jLength = treatmentData.data.treatmentType.length;
    }               
    for(var j=0;j<jLength;j++){  
        var optionItem  = document.createElement("option");
        optionItem.innerText = treatmentData.data.treatmentType[j].name;
        optionItem.setAttribute("value", treatmentData.data.treatmentType[j].ID);
        document.getElementById('treatmenttypelist').appendChild(optionItem);
    }
}
function canEdit(){
    $( ".banned" ).parent().parent().parent().parent().parent().find(".canEdit").hide();
    $( ".banned" ).parent().parent().parent().find(".tabledit-toolbar-column").hide();    
}
function viewTreatmentData(dataIn) {
    treatmentData = dataIn;
	if(treatmentData.code==0){
		alert(treatmentData.msg);
    }else if(treatmentData.code==2){
        alert(treatmentData.msg);
        reLogin();
	}else{    
		/* Handle !data situation */
	    if (!treatmentData.data.treatment) {
	        iLength = 0;
	    } else {
	        iLength = treatmentData.data.treatment.length;
	    }			    							
	    for(var i=0;i<iLength;i++){
	    	var trItem = document.createElement("tr");
	    	var tdID = document.createElement("td");
	    	var tdTreatmentName = document.createElement("td");
			var tdTreatmentType = document.createElement("td");
            var treatmentTypeID = treatmentData.data.treatment[i].treatmentTypeID;
			tdID.innerText = treatmentData.data.treatment[i].ID;
            if(treatmentData.data.treatment[i].canEdit == false){
                tdID.className = "banned";
            }            
	    	tdTreatmentName.innerText = treatmentData.data.treatment[i].name;
            if (!treatmentData.data.treatmentType) {
                jLength = 0;
            } else {
                jLength = treatmentData.data.treatmentType.length;
            }               
            for(var j=0;j<jLength;j++){  
                if(treatmentData.data.treatmentType[j].ID == treatmentTypeID){
                    tdTreatmentType.innerText = treatmentData.data.treatmentType[j].name;
                }
            }
	    	trItem.appendChild(tdID);
	    	trItem.appendChild(tdTreatmentName);
	    	trItem.appendChild(tdTreatmentType);
	    	document.getElementById('tablebody').appendChild(trItem);
	    }
        // Put the data into jsonArr[]
        if (!treatmentData.data.treatmentType) {
            kLength = 0;
        } else {
            kLength = treatmentData.data.treatmentType.length;
        }          
        for (var k = 0; k < kLength; k++) {
            jsonObj[treatmentData.data.treatmentType[k].ID]=treatmentData.data.treatmentType[k].name;
        }        
	}
}    
	
function tableData(){
    $('#tabledit').Tabledit({
        //url: 'api/getTreatment.php',
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
            editable: [[1, 'treatmentName'],[2, 'treatmentType', JSON.stringify(jsonObj)]]
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