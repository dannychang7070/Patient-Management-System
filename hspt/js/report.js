//Global Variables
var token;

$(document).ready(function () {
	token = getCookie("token");
	//get現在時間
	var dt = new Date();
	calcDate(dt.getFullYear(), dt.getMonth()+1, dt.getDate());
    calcDate1(dt.getFullYear(), dt.getMonth()+1, dt.getDate());
    calcDate2(dt.getFullYear(), dt.getMonth()+1, dt.getDate());
    calcDate3(dt.getFullYear(), dt.getMonth()+1, dt.getDate());
    calcDate4(dt.getFullYear(), dt.getMonth()+1, dt.getDate());
    $("#daily_selectYear, #daily_selectMonth").change(editTimeDate);
    $("#month_selectYear1, #month_selectMonth1").change(editTimeDate1);
    $("#month_selectYear2, #month_selectMonth2").change(editTimeDate2);
    $("#merchandise_selectYear1, #merchandise_selectMonth1").change(editTimeDate3);
    $("#merchandise_selectYear2, #merchandise_selectMonth2").change(editTimeDate4);

    //button for download daily report
    $(document).on('click', 'button#dailyReport', function (){
        var final_daily_date = document.getElementById("daily_selectYear").value+"-"+document.getElementById("daily_selectMonth").value+"-"+document.getElementById("daily_selectDay").value;
        sendDataToAPI(final_daily_date);        
    });

    //button for download month report
    $(document).on('click', 'button#monthReport', function (){
        var month_first_date = document.getElementById("month_selectYear1").value+"-"+document.getElementById("month_selectMonth1").value+"-"+document.getElementById("month_selectDay1").value;
        var month_last_date = document.getElementById("month_selectYear2").value+"-"+document.getElementById("month_selectMonth2").value+"-"+document.getElementById("month_selectDay2").value;
        if((new Date(month_first_date).getTime() > new Date(month_last_date).getTime())){
            alert("請注意前後時間!");
        }else{
            sendDataToAPI2(month_first_date, month_last_date);                
        }
    
    });

    //button for download merchandise report
    $(document).on('click', 'button#merchandiseReport', function (){
        var merchandise_first_date = document.getElementById("merchandise_selectYear1").value+"-"+document.getElementById("merchandise_selectMonth1").value+"-"+document.getElementById("merchandise_selectDay1").value;
        var merchandise_last_date = document.getElementById("merchandise_selectYear2").value+"-"+document.getElementById("merchandise_selectMonth2").value+"-"+document.getElementById("merchandise_selectDay2").value;
  
        if((new Date(merchandise_first_date).getTime() > new Date(merchandise_last_date).getTime())){
            alert("請注意前後時間!");
        }else{
            sendDataToAPI3(merchandise_first_date, merchandise_last_date);         
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

//API呼叫函數： report_merchandise.php
function sendDataToAPI3(merchandise_first_date, merchandise_last_date){
    $.post({
        url: "api/report_merchandise.php",
        data: JSON.stringify({
            // account: "admin",
            token: token,
            from: merchandise_first_date,
            to: merchandise_last_date           
        }),
        success: function (jsonData) {
            if(jsonData.code == 0){
                alert("下載失敗，原因："+jsonData.msg);
            }else if(jsonData.code==2){
                alert(jsonData.msg);
                reLogin();    
            }else{
                $("#dvjson3").excelexportjs({
                  containerid: "dvjson",
                  datatype: 'json',
                  dataset: jsonData.data,
                  columns: getColumns(jsonData.data),   
                });
            } 
        },
        fail: function () {
            alert("連線失敗");
        },
        contentType: "application/json;charset=UTF-8",
    });
}

//API呼叫函數： report_month.php
function sendDataToAPI2(month_first_date, month_last_date){
    $.post({
        url: "api/report_month.php",
        data: JSON.stringify({
            // account: "admin",
            token: token,
            from: month_first_date,
            to: month_last_date           
        }),
        success: function (jsonData) {
            if(jsonData.code == 0){
                alert("下載失敗，原因："+jsonData.msg);
            }else if(jsonData.code==2){
                alert(jsonData.msg);
                reLogin();                 
            }else{
                $("#dvjson2").excelexportjs({
                  containerid: "dvjson",
                  datatype: 'json',
                  dataset: jsonData.data,
                  columns: getColumns(jsonData.data),   
                });
            } 
        },
        fail: function () {
            alert("連線失敗");
        },
        contentType: "application/json;charset=UTF-8",
    });
}

//API呼叫函數： report_daily.php
function sendDataToAPI(final_daily_date){
    $.post({
        url: "api/report_daily.php",
        data: JSON.stringify({
            // account: "admin",
            token: token,
            date: final_daily_date           
        }),
        success: function (jsonData) {
            if(jsonData.code == 0){
                alert("下載失敗，原因："+jsonData.msg);
            }else if(jsonData.code==2){
                alert(jsonData.msg);
                reLogin();                 
            }else{
                $("#dvjson").excelexportjs({
                  containerid: "dvjson",
                  datatype: 'json',
                  dataset: jsonData.data,
                  columns: getColumns(jsonData.data),   
                });
            } 
        },
        fail: function () {
            alert("連線失敗");
        },
        contentType: "application/json;charset=UTF-8",
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
function editTimeDate() {
    var yearSelected = $("#daily_selectYear").val();
    var monthSelected = $("#daily_selectMonth").val();
    var daySelected = $("#daily_selectDay").val();

    calcDate(yearSelected, monthSelected, daySelected, 0, 0, 0);
}

function editTimeDate1() {
    var yearSelected = $("#month_selectYear1").val();
    var monthSelected = $("#month_selectMonth1").val();
    var daySelected = $("#month_selectDay1").val();

    calcDate1(yearSelected, monthSelected, daySelected, 0, 0, 0);
}

function editTimeDate2() {
    var yearSelected = $("#month_selectYear2").val();
    var monthSelected = $("#month_selectMonth2").val();
    var daySelected = $("#month_selectDay2").val();

    calcDate2(yearSelected, monthSelected, daySelected, 0, 0, 0);
}

function editTimeDate3() {
    var yearSelected = $("#merchandise_selectYear1").val();
    var monthSelected = $("#merchandise_selectMonth1").val();
    var daySelected = $("#merchandise_selectDay1").val();

    calcDate3(yearSelected, monthSelected, daySelected, 0, 0, 0);
}

function editTimeDate4() {
    var yearSelected = $("#merchandise_selectYear2").val();
    var monthSelected = $("#merchandise_selectMonth2").val();
    var daySelected = $("#merchandise_selectDay2").val();

    calcDate4(yearSelected, monthSelected, daySelected, 0, 0, 0);
}
/* Handle date input rules */
function calcDate(yearIn, monthIn, dayIn, hourIn, minuteIn) {
    var todayDate = new Date(),
        monthLimit = 0,
        dayLimit = 0;
    
    // Reset calendar
    $("#daily_selectYear").html("");
    $("#daily_selectMonth").html("");
    $("#daily_selectDay").html("");

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
        
        $("#daily_selectYear").append(yearOption);
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
        
        $("#daily_selectMonth").append(monthOption);
    }
    
    // DAY
    for (var k=1; k<=dayLimit; k++) {
        var dayOption = $("<option></option>").text(("0"+k).slice(-2)).val(("0"+k).slice(-2));
        
        if (k == dayIn) {
            dayOption.attr("selected","selected");
        }
        
        $("#daily_selectDay").append(dayOption);
    }            

}

function calcDate1(yearIn, monthIn, dayIn, hourIn, minuteIn) {
    var todayDate = new Date(),
        monthLimit = 0,
        dayLimit = 0;
    
    // Reset calendar
    $("#month_selectYear1").html("");
    $("#month_selectMonth1").html("");
    $("#month_selectDay1").html("");

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
        
        $("#month_selectYear1").append(yearOption);
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
        
        $("#month_selectMonth1").append(monthOption);
    }
    
    // DAY
    for (var k=1; k<=dayLimit; k++) {
        var dayOption = $("<option></option>").text(("0"+k).slice(-2)).val(("0"+k).slice(-2));
        
        if (k == dayIn) {
            dayOption.attr("selected","selected");
        }
        
        $("#month_selectDay1").append(dayOption);
    }            

}

function calcDate2(yearIn, monthIn, dayIn, hourIn, minuteIn) {
    var todayDate = new Date(),
        monthLimit = 0,
        dayLimit = 0;
    
    // Reset calendar
    $("#month_selectYear2").html("");
    $("#month_selectMonth2").html("");
    $("#month_selectDay2").html("");

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
        
        $("#month_selectYear2").append(yearOption);
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
        
        $("#month_selectMonth2").append(monthOption);
    }
    
    // DAY
    for (var k=1; k<=dayLimit; k++) {
        var dayOption = $("<option></option>").text(("0"+k).slice(-2)).val(("0"+k).slice(-2));
        
        if (k == dayIn) {
            dayOption.attr("selected","selected");
        }
        
        $("#month_selectDay2").append(dayOption);
    }            

}

function calcDate3(yearIn, monthIn, dayIn, hourIn, minuteIn) {
    var todayDate = new Date(),
        monthLimit = 0,
        dayLimit = 0;
    
    // Reset calendar
    $("#merchandise_selectYear1").html("");
    $("#merchandise_selectMonth1").html("");
    $("#merchandise_selectDay1").html("");

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
        
        $("#merchandise_selectYear1").append(yearOption);
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
        
        $("#merchandise_selectMonth1").append(monthOption);
    }
    
    // DAY
    for (var k=1; k<=dayLimit; k++) {
        var dayOption = $("<option></option>").text(("0"+k).slice(-2)).val(("0"+k).slice(-2));
        
        if (k == dayIn) {
            dayOption.attr("selected","selected");
        }
        
        $("#merchandise_selectDay1").append(dayOption);
    }            

}

function calcDate4(yearIn, monthIn, dayIn, hourIn, minuteIn) {
    var todayDate = new Date(),
        monthLimit = 0,
        dayLimit = 0;
    
    // Reset calendar
    $("#merchandise_selectYear2").html("");
    $("#merchandise_selectMonth2").html("");
    $("#merchandise_selectDay2").html("");

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
        
        $("#merchandise_selectYear2").append(yearOption);
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
        
        $("#merchandise_selectMonth2").append(monthOption);
    }
    
    // DAY
    for (var k=1; k<=dayLimit; k++) {
        var dayOption = $("<option></option>").text(("0"+k).slice(-2)).val(("0"+k).slice(-2));
        
        if (k == dayIn) {
            dayOption.attr("selected","selected");
        }
        
        $("#merchandise_selectDay2").append(dayOption);
    }            

}