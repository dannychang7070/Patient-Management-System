//Global Variables
var merchandiseData;
var inventoryData;
var detailButtonClicked;
var inventory_ID;
var jsonDepartmentObj = {};
var token;

$(document).ready( function () {
    token = getCookie("token");
    hideAllContent();
    $(document).on('click', 'button.tabledit-add-button', function(){	
        $("#lightBoxColumn").show();
        $('#warning').val('');
        $('#new_price').val('');
        showDepartmentList();
    }); 
    $(document).on('click', '#lightBoxCloseButton', function(){ 
        $("#lightBoxColumn").hide();
    }); 
    $(document).on('click', 'button.showAll', function(){   
        window.location.href = "merchandise.html";
    });  
    $(document).on('click', 'button.tabledit-storage-button', function(){ 
        //get現在時間
        var dt = new Date();
        //左上角日期
        calcDate(dt.getFullYear(), dt.getMonth()+1, dt.getDate(), dt.getHours(), dt.getMinutes() );
        $("#selectYear, #selectMonth").change(editTimeDate);          
        $("#inventoryBoxColumn").show();
        detailButtonClicked = $(this).parent().parent().parent().parent().attr("id");
        showInventoryList();
        $('#newInventoryStatus').val('1');
        $('#newInventoryAmount').val(''); 
        $('#newTotalCost').val('');
        $('#newUnitPrice').val('');          
    });      
    $(document).on('click', '#inventoryBoxCloseButton', function(){ 
        $("#inventoryBoxColumn").hide();
        $("#inventory_list").empty();
    });     
    $(document).on('click', '#add_newMerchandise', function(){ 
        addMerchandise();
    });     
    $(document).on('click', 'button.inventoryDeleteButton', function(){   
        inventory_ID = $(this).attr("value");
        deleteInventory();
    });     
    $(".tabledit-input").keypress(function (evt) {
        //Deterime where our character code is coming from within the event
        var charCode = evt.charCode || evt.keyCode;
        if (charCode  == 13) { //Enter key's keycode
        return false;
        }
    });
    //只要有Keyup在入庫數量+總成本(元) 都要更新每件成本
    $(document).on('keyup', 'input#newInventoryAmount', function(){      
        updateTotalNumber();        
    }); 
    $(document).on('keyup', 'input#newTotalCost', function(){      
        updateTotalNumber();        
    });  
    $(document).on('click', 'button#addNewInventory', function(){   
        addInventory();
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
function addInventory() {
    var r = confirm("確定要新增此筆資料?");
    if (r == true) {
        var new_type = parseInt(document.getElementById("newInventoryStatus").value);
        var new_time = document.getElementById("selectYear").value+"-"+document.getElementById("selectMonth").value+"-"+document.getElementById("selectDay").value+" "+document.getElementById("selectHour").value+":"+document.getElementById("selectMinute").value+":00";
        var new_amount = parseInt(document.getElementById("newInventoryAmount").value);
        var new_cost = parseInt(document.getElementById("newTotalCost").value);   
        if (new_type == 1 && new_amount<=0){
            alert("進貨數量只為正");
        }else{
            if (new_cost<0){
                alert("價錢不能為負值");
            }else{
                $.post({
                    url: 'api/insertInventory.php',
                    data: JSON.stringify({
                        // User
                        // account: "admin",
                        token: token,
                        merchandiseID: parseInt(detailButtonClicked),
                        type: new_type,
                        time: new_time,
                        amount: new_amount,
                        cost: new_cost
                    }),      
                    success: function (jsonData) { // Callback function when successful
                        viewDeletemessage(jsonData); // Call VIEW function 
                    },
                    fail: function () {
                        alert("ERROR: Database connection failed.");
                    },
                    contentType: "application/json;charset=UTF-8",                  
                })  
            }
        }       
    } else {

    }
}

// Update 每件成本
function updateTotalNumber() {
    var total_number = $("#newInventoryAmount").val();
    var total_money = $("#newTotalCost").val();
    if (!total_number || !total_money){

    } else {
        var result = total_money/Math.abs(total_number);
        $("#newUnitPrice").val(result);
    }
}

function editTimeDate() {
    var yearSelected = $("#selectYear").val();
    var monthSelected = $("#selectMonth").val();
    var daySelected = $("#selectDay").val();

    calcDate(yearSelected, monthSelected, daySelected, 0, 0, 0);
}

/* Handle date input rules */
function calcDate(yearIn, monthIn, dayIn, hourIn, minuteIn) {
    var todayDate = new Date(),
        monthLimit = 0,
        dayLimit = 0;
    
    // Reset calendar
    $("#selectYear").html("");
    $("#selectMonth").html("");
    $("#selectDay").html("");
    $("#selectHour").html("");
    $("#selectMinute").html("");

    // HANDLE LEAP YEARS AND DAYS IN A MONTH
    // YEAR
    for (var i=todayDate.getFullYear(); i>=1900; i--) {
        var yearOption = $("<option></option>").text(i).val(i);
        
        if (i == yearIn) {
            yearOption.attr("selected","selected");
        }
        
        if (yearIn == todayDate.getFullYear()) {
            monthLimit = todayDate.getMonth()+1;
            if (monthIn > todayDate.getMonth()+1) {
                monthIn = 1;
            }
        } else {
            monthLimit = 12;
        }
        
        $("#selectYear").append(yearOption);
    }
    
    // MONTH
    for (var j=1; j<=monthLimit; j++) {
        var monthOption = $("<option></option>").text(("0"+j).slice(-2)).val(("0"+j).slice(-2));
        
        if (j == monthIn) {
            monthOption.attr("selected","selected");
            
            if (yearIn == todayDate.getFullYear() && monthIn == todayDate.getMonth()+1) {
                dayLimit = todayDate.getDate();
                
                if (dayIn > todayDate.getDate()) {
                    dayIn = 1;
                }
            } else {
                if (monthIn == 2) {
                    if(yearIn%400==0){
                        dayLimit = 29;    
                    } else if (yearIn%100 == 0) {
                        dayLimit = 28;
                    } else if (yearIn%4==0){
                        dayLimit = 29;
                    } else{
                        dayLimit = 28;
                    }
                } else if (monthIn == 4 || monthIn == 6 || monthIn == 9 || monthIn == 11) {
                    dayLimit = 30;
                } else {
                    dayLimit = 31;
                }
            }
        }
        
        $("#selectMonth").append(monthOption);
    }
    
    // DAY
    for (var k=1; k<=dayLimit; k++) {
        var dayOption = $("<option></option>").text(("0"+k).slice(-2)).val(("0"+k).slice(-2));
        
        if (k == dayIn) {
            dayOption.attr("selected","selected");
        }
        
        $("#selectDay").append(dayOption);
    }

    // HOUR
    for (var a=0; a<24; a++) {
        var hourOption = $("<option></option>").text(("0"+a).slice(-2)).val(("0"+a).slice(-2));
        
        if (a == hourIn) {
            hourOption.attr("selected","selected");
        }
        
        $("#selectHour").append(hourOption);
    }    

    // MINUTE
    for (var b=0; b<60; b++) {
        var minuteOption = $("<option></option>").text(("0"+b).slice(-2)).val(("0"+b).slice(-2));
        
        if (b == minuteIn) {
            minuteOption.attr("selected","selected");
        }
        
        $("#selectMinute").append(minuteOption);
    }          

}
function deleteInventory(){
    var r = confirm("確定要刪除此筆資料?");
    if (r == true) {
          
        $.post({
            url: 'api/deleteInventory.php',
            data: JSON.stringify({
                // User
                // account: "admin",
                token: token,
                inventoryID: inventory_ID
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
function showInventoryList(){
    $.post({
        url: 'api/getInventory.php',
        data: JSON.stringify({
            // User
            // account: "admin",
            token: token,
            merchandiseID: detailButtonClicked
        }),      
        success: function (jsonData) { // Callback function when successful
            viewInventoryListData(jsonData); // Call VIEW function 
        },
        fail: function () {
            alert("ERROR: Database connection failed.");
        },
        contentType: "application/json;charset=UTF-8",                  
    }).done(function(data){
    })   
}
function viewInventoryListData(jsonData){
    inventoryData = jsonData;
    if(inventoryData.code==2){
        alert(inventoryData.msg);
        reLogin();
    }else{
        if (!inventoryData.data.list) {
            jLength = 0;
        } else {
            jLength = inventoryData.data.list.length;
        }               
        for(var j=0;j<jLength;j++){  
            var optionItem = document.createElement("tr");
            var td_time = document.createElement("td");
            var td_type = document.createElement("td");
            var td_amount = document.createElement("td");
            var td_total_cost = document.createElement("td");
            var td_people = document.createElement("td");
            var td_unit_cost = document.createElement("td");
            var td_manipulate = document.createElement("td");
            var button_delete = document.createElement("button");
            td_time.innerText = inventoryData.data.list[j].time;
            td_type.innerText = inventoryData.data.list[j].type;
            td_amount.innerText = inventoryData.data.list[j].amount;
            td_total_cost.innerText = inventoryData.data.list[j].totalCost;
            td_people.innerText = inventoryData.data.list[j].account;
            td_unit_cost.innerText = inventoryData.data.list[j].unitCost;
            td_manipulate.setAttribute("id", "inventoryButtonID"+inventoryData.data.list[j].ID);
            button_delete.innerText = "刪除";
            button_delete.setAttribute("class","inventoryDeleteButton");
            button_delete.setAttribute("value",inventoryData.data.list[j].ID);
            optionItem.setAttribute("id", "inventoryID"+inventoryData.data.list[j].ID);
            optionItem.setAttribute("value", inventoryData.data.list[j].ID);
            document.getElementById('inventory_list').appendChild(optionItem);
            document.getElementById('inventoryID'+inventoryData.data.list[j].ID).appendChild(td_time);
            document.getElementById('inventoryID'+inventoryData.data.list[j].ID).appendChild(td_type);
            document.getElementById('inventoryID'+inventoryData.data.list[j].ID).appendChild(td_amount);
            document.getElementById('inventoryID'+inventoryData.data.list[j].ID).appendChild(td_total_cost);
            document.getElementById('inventoryID'+inventoryData.data.list[j].ID).appendChild(td_people);
            document.getElementById('inventoryID'+inventoryData.data.list[j].ID).appendChild(td_unit_cost);
            document.getElementById('inventoryID'+inventoryData.data.list[j].ID).appendChild(td_manipulate);
            document.getElementById('inventoryButtonID'+inventoryData.data.list[j].ID).appendChild(button_delete);
        }

        //for inventoryBoxTitle
        var merchandise_name = inventoryData.data.merchandise.name;
        var merchandise_size = inventoryData.data.merchandise.size;
        var merchandise_departmentName = inventoryData.data.merchandise.departmentName;
        var merchandise_remaining = inventoryData.data.merchandise.remaining;
        document.getElementById('inventoryBoxTitle').innerHTML = merchandise_name+"-"+merchandise_size+" / "+merchandise_departmentName+" / 剩餘"+merchandise_remaining+"件";

    }
}
function showDepartmentList(){
    $("#departmentlist option[value!= 0]").remove();
    if (!merchandiseData.data.department) {
        jLength = 0;
    } else {
        jLength = merchandiseData.data.department.length;
    }               
    for(var j=0;j<jLength;j++){  
        var optionItem  = document.createElement("option");
        optionItem.innerText = merchandiseData.data.department[j].name;
        optionItem.setAttribute("value", merchandiseData.data.department[j].ID);
        document.getElementById('departmentlist').appendChild(optionItem);
    }
}
function addMerchandise() {
    var r = confirm("確定要新增此筆資料?");
    if (r == true) {
        var new_name = document.getElementById("new_name").value;
        var new_size = document.getElementById("new_size").value;
        var new_warning = parseInt(document.getElementById("warning").value);
        var new_price = parseInt(document.getElementById("new_price").value);
        var new_department = parseInt($(document.getElementById('departmentlist')).find('option:selected').val());           
        $.post({
            url: 'api/updateMerchandise.php',
            data: JSON.stringify({
                // User
                // account: "admin",
                token: token,
                merchandiseID: 0,
                name: new_name,
                size: new_size,
                warning: new_warning,
                price: new_price,
                departmentID: new_department
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
function viewMerchandiseData(dataIn) {
    merchandiseData = dataIn;
	if(merchandiseData.code==0){
		alert(merchandiseData.msg);
    }else if(merchandiseData.code==2){
        alert(merchandiseData.msg);
        reLogin();
	}else{    
		/* Handle !data situation */
	    if (!merchandiseData.data.merchandise) {
	        iLength = 0;
	    } else {
	        iLength = merchandiseData.data.merchandise.length;
	    }			    							
	    for(var i=0;i<iLength;i++){
	    	var trItem = document.createElement("tr");
            var tdWarningFlag = document.createElement("td");            
	    	var tdID = document.createElement("td");
	    	var tdName = document.createElement("td");
			var tdSize = document.createElement("td");
			var tdDepartment = document.createElement("td");
            var tdRemain = document.createElement("td");
            var tdWarning = document.createElement("td");
            var tdPrice = document.createElement("td");  

            
            if (parseInt(merchandiseData.data.merchandise[i].remaining) < parseInt(merchandiseData.data.merchandise[i].warning)){
                var tdBindTag = document.createElement("a");
                var tdBindSpan = document.createElement("span");
                tdBindTag.setAttribute("href","merchandise.html?account=admin&isOnlyWarning=YES");                
                tdBindSpan.className = "glyphicon glyphicon-exclamation-sign";
                tdBindSpan.style="color:red";
                tdBindTag.appendChild(tdBindSpan);
                tdWarningFlag.appendChild(tdBindTag);
            }else{
                tdWarningFlag.innerText = "";
            }
            tdID.innerText = merchandiseData.data.merchandise[i].ID;
            tdName.innerText = merchandiseData.data.merchandise[i].name;
	    	tdSize.innerText = merchandiseData.data.merchandise[i].size;
            tdDepartment.innerText = merchandiseData.data.merchandise[i].departmentName;
            tdRemain.innerText = merchandiseData.data.merchandise[i].remaining;
            tdWarning.innerText = merchandiseData.data.merchandise[i].warning;
	    	tdPrice.innerText = merchandiseData.data.merchandise[i].price;
            trItem.appendChild(tdWarningFlag);
	    	trItem.appendChild(tdID);
	    	trItem.appendChild(tdName);
	    	trItem.appendChild(tdSize);
	    	trItem.appendChild(tdDepartment);
            trItem.appendChild(tdRemain);
            trItem.appendChild(tdWarning);
            trItem.appendChild(tdPrice);            
	    	document.getElementById('tablebody').appendChild(trItem);
	    }
        // Put the data into jsonDepartmentObj[]
        if (!merchandiseData.data.department) {
            nLength = 0;
        } else {
            nLength = merchandiseData.data.department.length;
        }          
        for (var n = 0; n < nLength; n++) {
            jsonDepartmentObj[merchandiseData.data.department[n].ID] = merchandiseData.data.department[n].name;
        }

        //輸入入庫人
        $("#newUserAccount").val('admin');    
	}
}    
	
function tableData(){
    $('#tabledit').Tabledit({
        eventType: 'dblclick',
        editButton: true,
        deleteButton: true,
        storageButton: true,
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
            storage: {
                class: 'btn btn-sm btn-primary',
                html: '<span class="glyphicon glyphicon-download-alt"></span> Storage',
                action: 'storage'
            }                
        },
        columns: {
            identifier: [1, 'id'],
            editable: [[2, 'name'],[3, 'size'],[4,'department', JSON.stringify(jsonDepartmentObj)],[6, 'warning'],[7, 'price']]
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

function viewDeletemessage(dataIn) {
    deleteData = dataIn;
	if(deleteData.code==0){
		alert(deleteData.msg);
	} else if(deleteData.code==2){
        alert(deleteData.msg);
        reLogin();
    } else {   
		alert(deleteData.msg);
		location.reload();
	}
}

/* hideAllContent */
function hideAllContent() {
    $("#lightBoxColumn").hide();
    $("#inventoryBoxColumn").hide();
    //$(document).on('onLoad', '.detailButtonLink', hide());
}