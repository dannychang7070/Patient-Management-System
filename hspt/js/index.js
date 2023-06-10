/* JS: index */

globals: $:false; // Ignore JSLint/JSHint error: "$ is not defined"

// 全域變數
// var page_account = "admin";
// var page_password = "hspt";
var count_fire = 0;
var search_keyword;
var comboData;
var init_Date;
var init_yearIn;
var init_monthIn;
var init_dayIn;
var token;
$(document).ready(function () {
    token = getCookie("token");
    hideAllContent();
    //getUser(); // Get user ID and request
    buttonCustom();
    buttonFire();
    $(document).on('click', 'button.tabledit-add-button', function(){   
        $("#lightPatientBoxColumn").show();
        $('#add_Patient_Name').val('');
        $('#add_Patient_ID').val('');   
        $('#add_Patient_Cell').val('');
        $('#add_Patient_Phone').val('');   
        $('#add_Patient_Address').val('');
        $('#add_Patient_Note').val('');                 
        $('#add_Patient_Gender').val('1');       
        showDepartmentList();
        init_date();
        calcAddDate(init_yearIn, init_monthIn, init_dayIn);
    });

    $("#addPatientBoxTitleBirthYear, #addPatientBoxTitleBirthMonth").change(addPatientInfoDate);  

    $(document).on('click', '#lightPatientBoxCloseButton', function(){ 
        $("#lightPatientBoxColumn").hide();
    });    

    $(document).on('click', '#add_newPatient', function(){ 
        addPatient();
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
function addPatient() {
    var r = confirm("確定要新增此筆資料?");
    if (r == true) {
        var new_patient_name = document.getElementById("add_Patient_Name").value;
        var new_patient_birthday = document.getElementById("addPatientBoxTitleBirthYear").value+"-"+document.getElementById("addPatientBoxTitleBirthMonth").value+"-"+document.getElementById("addPatientBoxTitleBirthDay").value;
        var new_patient_pid = document.getElementById("add_Patient_ID").value;
        var new_patient_gender = $(document.getElementById('add_Patient_Gender')).find('option:selected').text();  
        var new_patient_phone = document.getElementById("add_Patient_Cell").value;
        var new_patient_tel = document.getElementById("add_Patient_Phone").value;
        var new_patient_address = document.getElementById("add_Patient_Address").value;
        var new_patient_departmentID = parseInt($(document.getElementById('departmentlist')).find('option:selected').val());
        var new_patient_note = document.getElementById("add_Patient_Note").value;                            
        $.post({
            url: 'api/insertCaseDepartment.php',
            data: JSON.stringify({
                // User
                // account: "admin",
                token: token,
                name: new_patient_name,
                birthday: new_patient_birthday,
                pid: new_patient_pid,
                gender: new_patient_gender,
                phone: new_patient_phone,
                tel: new_patient_tel,
                address: new_patient_address,
                departmentID: new_patient_departmentID,
                note: new_patient_note
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

function init_date(){
    init_Date = new Date();
    init_yearIn = init_Date.getFullYear();
    init_monthIn = init_Date.getMonth()+1;
    init_dayIn = init_Date.getDate();
}

function showDepartmentList(){
    $("#departmentlist option[value!= 0]").remove();
    $.post({
        url: "api/comboDepartment.php", // URL of API    
        data: JSON.stringify({
            token: token
        }),    
        success: function (jsonData) { // Callback function when successful
            showListOption(jsonData); // Call VIEW function 
        },
        fail: function () {
            alert("ERROR at askDBData: Database connection failed.");
        },
        contentType: "application/json;charset=UTF-8",
    }); 
}
function showListOption(jsonData){
    comboData = jsonData;
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

function addPatientInfoDate() {
    var yearSelected = $("#addPatientBoxTitleBirthYear").val();
    var monthSelected = $("#addPatientBoxTitleBirthMonth").val();
    var daySelected = $("#addPatientBoxTitleBirthDay").val();

    calcAddDate(yearSelected, monthSelected, daySelected);
}
/* Handle date input rules */
function calcAddDate(yearIn, monthIn, dayIn) {
    var todayDate = new Date(),
        monthLimit = 0,
        dayLimit = 0;

    // Reset calendar
    $("#addPatientBoxTitleBirthYear").html("");
    $("#addPatientBoxTitleBirthMonth").html("");
    $("#addPatientBoxTitleBirthDay").html("");
    
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
        
        $("#addPatientBoxTitleBirthYear").append(yearOption);
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
        
        $("#addPatientBoxTitleBirthMonth").append(monthOption);
    }
    
    // DAY
    for (var k=1; k<=dayLimit; k++) {
        var dayOption = $("<option></option>").text(("0"+k).slice(-2)).val(("0"+k).slice(-2));
        
        if (k == dayIn) {
            dayOption.attr("selected","selected");
        }
        
        $("#addPatientBoxTitleBirthDay").append(dayOption);
    }
}

/* buttonCustom */
function buttonCustom() {
    $("#searchIconImg").button({
        icons: {
            primary: 'ui-icon-trash'
        },
        text: false
    }); 
}

/* buttonFire */
function buttonFire() {
    $("#searchIconImg").click(function() {
        if (count_fire>0){
            $(".newHospitalSectData").remove();
            $(".newBookmarkData").remove();
        }
        search_keyword = $(this).parent().parent().find('#searchbarInput').val();
        askDBData(); // Ask for data from DB
        toggleDetailButton(); // Rules for interacting with detailButton
        $("#backgroundimage").hide();
        count_fire++;        
    });    
}
/*window.onload = function () {
    document.querySelector('.detailButtonLink').hide();
}*/

/* hideAllContent */
function hideAllContent() {
    $("#lightBoxColumn").hide();
    $("#lightPatientBoxColumn").hide();
    
    //$(document).on('onLoad', '.detailButtonLink', hide());
}

/* Communicate with API (AJAX) */
function askDBData() {
    $.post({
        url: "api/getCaseDepartment.php", // URL of API        
        data: JSON.stringify({
            // User
            // account: page_account,
            token: token,
            searchWord: search_keyword,
            // password: page_password,
        }),
        success: function (jsonData) { // Callback function when successful
            showDBData(jsonData); // Call VIEW function 
        },
        fail: function () {
            alert("ERROR at askDBData: Database connection failed.");
        },
        contentType: "application/json;charset=UTF-8",
    });    
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
/* Process returned data from DB*/
function showDBData(dataIn) {
    var dbData = dataIn;
    var newHospitalSect = document.getElementById('hospitalSectTemplate'); // Access hospitalSect template
    var newBookmark = document.getElementById('bookmarkTemplate');
    var newPatientItem = document.getElementById('patientItemTemplate'); // Access patientItem template
    var iLength = 0;
    var jLength = 0;

    /* Handle !data situation */
    if (!dbData.data.department) {
        alert(dbData.msg);
        // Handle idle too long
        if (dbData.code == 2) {
            reLogin();
        } else {
            location.reload();
        }
    } else {
        iLength = dbData.data.department.length;
    }
    
    
    for(i=0;i<iLength;i++){
        var departmentName = dbData.data.department[i].name;
        var departmentNickname = dbData.data.department[i].nickname;
        var departmentID = dbData.data.department[i].ID;

        /* Custom data for the new hospitalSect */

        newHospitalSect.content.querySelector('.hospitalSectContent').id = "hospitalSect[" + departmentID + "]";
        newHospitalSect.content.querySelector('.hospitalSect').setAttribute("name", departmentID);
        newHospitalSect.content.querySelector('.hospitalSect').classList.add("newHospitalSectData");
        newHospitalSect.content.querySelector('.hospitalName').innerHTML = departmentName;
        newHospitalSect.content.querySelector('.hospitalNameBlock').id = "hospitalTitle[" + departmentID + "]";
        /* Custom data for the bookmark */
      
        newBookmark.content.querySelector('.bookmarkLink').id = departmentID;
        newBookmark.content.querySelector('.bookmarkLink').classList.add("newBookmarkData");
        newBookmark.content.querySelector('.bookmarkLink').href = "#hospitalTitle[" + departmentID+"]";
        newBookmark.content.querySelector('.bookmarkLink').innerHTML = departmentName;
        
        
        /* Clone and show the new hospitalSect */
        document.getElementById('contentPart').appendChild(newHospitalSect.content.cloneNode(true));
        
        
        /* Clone and show the bookmark */
        document.getElementById('bookmarkBlock').appendChild(newBookmark.content.cloneNode(true));

        
        /* Handle !data situation */
        if (!dbData.data[departmentName]) {
            jLength = 0;
        } else {
            jLength = dbData.data[departmentName].length;
        }
        
        for (j=0;j<jLength;j++){
            /* Custom data for the new patientItem */
			
			/* 1.0->1.2  pass departmentID, caseID(department_patientID) and User Account*/
			var page_name = dbData.data[departmentName][j].name;
			var case_id = dbData.data[departmentName][j].department_patientID;

			newPatientItem.content.querySelector('.patientItemLink').href="page-curelist-edit.html?page_name="+encodeURIComponent(page_name)+"&case_id="+case_id+"&page_department="+departmentID+"&page_department_name="+encodeURIComponent(departmentName);
            
			newPatientItem.content.querySelector('.patientName').innerHTML = dbData.data[departmentName][j].name;
            newPatientItem.content.querySelector('.caseID').innerHTML = dbData.data[departmentName][j].department_patientID;
            
            newPatientItem.content.querySelector('.patientPhone1').innerHTML = dbData.data[departmentName][j].phone1;
            newPatientItem.content.querySelector('.patientPhone2').innerHTML = dbData.data[departmentName][j].phone2;
            
            newPatientItem.content.querySelector('.patientPhone1').innerHTML = dbData.data[departmentName][j].phone1;
            
            newPatientItem.content.querySelector('.detailButtonLink').id = "detailButton["+dbData.data[departmentName][j].department_patientID+"]";
            
            newPatientItem.content.querySelector('.detailButtonLink').setAttribute("value", [dbData.data[departmentName][j].department_patientID, dbData.data.department[i].ID]);
            
            
            /* Clone and show the new patientItem */
            document.getElementById('hospitalSect['+departmentID+']').appendChild(newPatientItem.content.cloneNode(true));
            //alert("OKK"+$(".detailButtonLink").val());
        }
    }
}

/* detailButton rules */
function toggleDetailButton() {
    //$('.detailButtonLink').hide(); // Hide.detailButton by default
    $('.patientItem').mouseover(function() {
        $(this).find('.detailButton').slideDown(100);
    });
    $('.patientItemLink').mouseleave(function() {
        $(this).find('.detailButton').slideUp(100);
    });
}
