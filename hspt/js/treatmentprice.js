//Global Variables
//var treatmentPriceData;
var jsonDiseaseObj = {};
var jsonDepartmentObj = {};
var jsonTreatmentTypeObj = {};
var token;
$(document).ready( function () {
    token = getCookie("token");
    hideAllContent();
    $(document).on('click', 'button.tabledit-add-button', function(){	
        $("#lightBoxColumn").show();
        showDiseaseList();
        showDepartmentList();                
        showTreatmentTypeList();
        $('#treatmentprice').val('');
    }); 
    $(document).on('click', '#lightBoxCloseButton', function(){ 
        $("#lightBoxColumn").hide();
    }); 
    $(document).on('click', 'button.showAll', function(){   
        window.location.href = "page-treatmentprice.html";
    });  
    $(document).on('click', '#add_newTreatmentPrice', function(){ 
        addTreatmentPrice();
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
function addTreatmentPrice() {
    var r = confirm("確定要新增此筆資料?");
    if (r == true) {
        var diseaseID = $(document.getElementById('diseaselist')).find('option:selected').val();
        var departmentID = $(document.getElementById('departmentlist')).find('option:selected').val();
        var treatmentTypeID = $(document.getElementById('treatmenttypelist')).find('option:selected').val();
        var price = document.getElementById("treatmentprice").value;
        $.post({
            url: 'api/updateDiseasePrice.php',
            data: JSON.stringify({
                // User
                // account: "admin",
                token: token,
                priceID: 0, 
                diseaseID:  diseaseID,
                departmentID: departmentID,
                treatmentTypeID: treatmentTypeID,
                price: price
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
function showDiseaseList(){
    $("#diseaselist option[value!= 0]").remove();   
    if (!treatmentPriceData.data.disease) {
        kLength = 0;
    } else {
        kLength = treatmentPriceData.data.disease.length;
    }               
    for(var k=0;k<kLength;k++){  
        var optionItem  = document.createElement("option");
        optionItem.innerText = treatmentPriceData.data.disease[k].name;
        optionItem.setAttribute("value", treatmentPriceData.data.disease[k].ID);
        document.getElementById('diseaselist').appendChild(optionItem);
    }
}
function showDepartmentList(){
    $("#departmentlist option[value!= 0]").remove(); 
    if (!treatmentPriceData.data.department) {
        jLength = 0;
    } else {
        jLength = treatmentPriceData.data.department.length;
    }               
    for(var j=0;j<jLength;j++){  
        var optionItem  = document.createElement("option");
        optionItem.innerText = treatmentPriceData.data.department[j].name;
        optionItem.setAttribute("value", treatmentPriceData.data.department[j].ID);
        document.getElementById('departmentlist').appendChild(optionItem);
    }
}
function showTreatmentTypeList(){
    $("#treatmenttypelist option[value!= 0]").remove(); 
    if (!treatmentPriceData.data.treatmentType) {
        mLength = 0;
    } else {
        mLength = treatmentPriceData.data.treatmentType.length;
    }               
    for(var m=0;m<mLength;m++){  
        var optionItem  = document.createElement("option");
        optionItem.innerText = treatmentPriceData.data.treatmentType[m].name;
        optionItem.setAttribute("value", treatmentPriceData.data.treatmentType[m].ID);
        document.getElementById('treatmenttypelist').appendChild(optionItem);
    }
}
function canEdit(){
    $( ".banned" ).parent().parent().parent().parent().parent().find(".canEdit").hide();
    $( ".banned" ).parent().parent().parent().find(".tabledit-toolbar-column").hide();    
}
function viewTreatmentPriceData(dataIn) {
    treatmentPriceData = dataIn;
	if(treatmentPriceData.code==0){
		alert(treatmentPriceData.msg);
    }else if(treatmentPriceData.code==2){
        alert(treatmentPriceData.msg);
        reLogin();
	}else{    
		/* Handle !data situation */
	    if (!treatmentPriceData.data.diseasePrice) {
	        iLength = 0;
	    } else {
	        iLength = treatmentPriceData.data.diseasePrice.length;
	    }			    							
	    for(var i=0;i<iLength;i++){
            var trItem = document.createElement("tr");
            var tdID = document.createElement("td");
            var tdDisease = document.createElement("td");
            var tdDepartment = document.createElement("td");
            var tdType = document.createElement("td");
            var tdPrice = document.createElement("td");
            if(treatmentPriceData.data.diseasePrice[i].canEdit == false){
                tdID.className = "banned";
            }
            tdID.innerText = treatmentPriceData.data.diseasePrice[i].ID;
            tdPrice.innerText = treatmentPriceData.data.diseasePrice[i].price;
            var diseaseID = treatmentPriceData.data.diseasePrice[i].diseaseID;
            var departmentID = treatmentPriceData.data.diseasePrice[i].departmentID;
            var treatmentTypeID = treatmentPriceData.data.diseasePrice[i].treatmentTypeID;

		    if (!treatmentPriceData.data.department) {
		        jLength = 0;
		    } else {
		        jLength = treatmentPriceData.data.department.length;
		    }		    	
            for(var j=0;j<jLength;j++){  
                if(treatmentPriceData.data.department[j].ID == departmentID){
                    tdDepartment.innerText = treatmentPriceData.data.department[j].name;
                }
            }

            if (!treatmentPriceData.data.disease) {
                kLength = 0;
            } else {
                kLength = treatmentPriceData.data.disease.length;
            }               
            for(var k=0;k<kLength;k++){  
                if(treatmentPriceData.data.disease[k].ID == diseaseID){
                    tdDisease.innerText = treatmentPriceData.data.disease[k].name;
                }
            }

            if (!treatmentPriceData.data.treatmentType) {
                mLength = 0;
            } else {
                mLength = treatmentPriceData.data.treatmentType.length;
            }               
            for(var m=0;m<mLength;m++){  
                if(treatmentPriceData.data.treatmentType[m].ID == treatmentTypeID){
                    tdType.innerText = treatmentPriceData.data.treatmentType[m].name;
                }
            }

	    	trItem.appendChild(tdID);
	    	trItem.appendChild(tdDisease);
	    	trItem.appendChild(tdDepartment);
	    	trItem.appendChild(tdType);
            trItem.appendChild(tdPrice);            
	    	document.getElementById('tablebody').appendChild(trItem);
	    }
        // Put the data into jsonDepartmentObj[]
        if (!treatmentPriceData.data.department) {
            nLength = 0;
        } else {
            nLength = treatmentPriceData.data.department.length;
        }          
        for (var n = 0; n < nLength; n++) {
            jsonDepartmentObj[treatmentPriceData.data.department[n].ID] = treatmentPriceData.data.department[n].name;
        }

        // Put the data into jsonDiseaseObj[]
        if (!treatmentPriceData.data.disease) {
            pLength = 0;
        } else {
            pLength = treatmentPriceData.data.disease.length;
        }          
        for (var p = 0; p < pLength; p++) {
            jsonDiseaseObj[treatmentPriceData.data.disease[p].ID]=treatmentPriceData.data.disease[p].name;
        }       

        // Put the data into jsonArr[]
        if (!treatmentPriceData.data.treatmentType) {
            qLength = 0;
        } else {
            qLength = treatmentPriceData.data.treatmentType.length;
        }          
        for (var q = 0; q < qLength; q++) {
            jsonTreatmentTypeObj[treatmentPriceData.data.treatmentType[q].ID]=treatmentPriceData.data.treatmentType[q].name;
        }                                      
	}
}    
	
function tableData(){
    $('#tabledit').Tabledit({
        //url: 'api/getDiseasePrice.php',
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
            editable: [[1, 'disease', JSON.stringify(jsonDiseaseObj)],[2, 'department', JSON.stringify(jsonDepartmentObj)],[3, 'type', JSON.stringify(jsonTreatmentTypeObj)],[4, 'price']]
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