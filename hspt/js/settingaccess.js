//Global Variables
var permissionData;
var message;
var addData;
var token;
$(document).ready( function () {
    token = getCookie("token");
    viewData()
    hideAllContent();
    $(document).on('click', 'button.tabledit-add-button', function(){   
        $("#lightBoxColumn").show();
    });     
    $(document).on('click', '#lightBoxCloseButton', function(){ 
        $("#lightBoxColumn").hide();
    });   
    $(document).on('click', 'button.tabledit-save-button', function(){ 
        var confirmation = confirm("確定修改權限?");
        if (confirmation == true) {
            var permissionDataAsJson = {};
            permissionDataAsJson["token"] = token;
            permissionDataAsJson["permission"] = getPermissionAsJSON();
            editPermission(JSON.stringify(permissionDataAsJson));
        } else{

        }
    });   
    $(document).on('click', '#add_role', function(){ 
        addNewRole();
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
//JSON轉換函數：會員權限內容轉換為JSON字串
function getPermissionAsJSON(){
    var data = [];
    var table = document.getElementById("tablebody");
    for (var i = 0, row; row = table.rows[i]; i++) {
        var permissionObject = {};
        var row_no = i + 1;
        var content = document.getElementById(row_no);
        permissionObject["ID"] = $(content).attr('value');
        permissionObject["name"] = $(content).html();
        if($('#'+row_no+'R1').prop("checked") == true){
            permissionObject["p01"] = 1;
        }else{
            permissionObject["p01"] = 0; 
        }
        if($('#'+row_no+'R2').prop("checked") == true){
            permissionObject["p02"] = 1;
        }else{
            permissionObject["p02"] = 0; 
        }
        if($('#'+row_no+'R3').prop("checked") == true){
            permissionObject["p03"] = 1;
        }else{
            permissionObject["p03"] = 0; 
        }
        if($('#'+row_no+'R4').prop("checked") == true){
            permissionObject["p04"] = 1;
        }else{
            permissionObject["p04"] = 0; 
        }   
        if($('#'+row_no+'R5').prop("checked") == true){
            permissionObject["p05"] = 1;
        }else{
            permissionObject["p05"] = 0; 
        }
        if($('#'+row_no+'R6').prop("checked") == true){
            permissionObject["p06"] = 1;
        }else{
            permissionObject["p06"] = 0; 
        } 
        if($('#'+row_no+'R7').prop("checked") == true){
            permissionObject["p07"] = 1;
        }else{
            permissionObject["p07"] = 0; 
        }
        if($('#'+row_no+'R8').prop("checked") == true){
            permissionObject["p08"] = 1;
        }else{
            permissionObject["p08"] = 0; 
        } 
        if($('#'+row_no+'R9').prop("checked") == true){
            permissionObject["p09"] = 1;
        }else{
            permissionObject["p09"] = 0; 
        }
        if($('#'+row_no+'R10').prop("checked") == true){
            permissionObject["p10"] = 1;
        }else{
            permissionObject["p10"] = 0; 
        } 
        if($('#'+row_no+'R11').prop("checked") == true){
            permissionObject["p11"] = 1;
        }else{
            permissionObject["p11"] = 0; 
        }
        if($('#'+row_no+'R12').prop("checked") == true){
            permissionObject["p12"] = 1;
        }else{
            permissionObject["p12"] = 0; 
        } 
        if($('#'+row_no+'R13').prop("checked") == true){
            permissionObject["p13"] = 1;
        }else{
            permissionObject["p13"] = 0; 
        }
        if($('#'+row_no+'R14').prop("checked") == true){
            permissionObject["p14"] = 1;
        }else{
            permissionObject["p14"] = 0; 
        } 
        if($('#'+row_no+'R15').prop("checked") == true){
            permissionObject["p15"] = 1;
        }else{
            permissionObject["p15"] = 0; 
        }
        if($('#'+row_no+'R16').prop("checked") == true){
            permissionObject["p16"] = 1;
        }else{
            permissionObject["p16"] = 0; 
        } 
        if($('#'+row_no+'R17').prop("checked") == true){
            permissionObject["p17"] = 1;
        }else{
            permissionObject["p17"] = 0; 
        }
        if($('#'+row_no+'R18').prop("checked") == true){
            permissionObject["p18"] = 1;
        }else{
            permissionObject["p18"] = 0; 
        } 
        if($('#'+row_no+'R19').prop("checked") == true){
            permissionObject["p19"] = 1;
        }else{
            permissionObject["p19"] = 0; 
        } 
        if($('#'+row_no+'R20').prop("checked") == true){
            permissionObject["p20"] = 1;
        }else{
            permissionObject["p20"] = 0; 
        }
        if($('#'+row_no+'R21').prop("checked") == true){
            permissionObject["p21"] = 1;
        }else{
            permissionObject["p21"] = 0; 
        }   
        if($('#'+row_no+'R22').prop("checked") == true){
            permissionObject["p22"] = 1;
        }else{
            permissionObject["p22"] = 0; 
        }      
        data.push(permissionObject);       
    }
    return data;    
}

function addNewRole() {
    var r = confirm("確定要新增此筆角色?");
    if (r == true) {
        var new_name = document.getElementById("new_role").value;
        if (new_name.length == 0){
            alert("請輸入角色名稱");
        }else{
            $.post({
                url: 'api/updatePermission.php',
                data: JSON.stringify({
                    // User
                    // account: "admin",
                    token: token,
                    permission:[{
                        ID: 0,
                        name: new_name,
                        p01:0,
                        p02:0,
                        p03:0,
                        p04:0,
                        p05:0,
                        p06:0,
                        p07:0,
                        p08:0,
                        p09:0,
                        p10:0,
                        p11:0,
                        p12:0,
                        p13:0,
                        p14:0,
                        p15:0,
                        p16:0,
                        p17:0,
                        p18:0,
                        p19:0,
                        p20:0,
                        p21:0,
                        p22:0
                    }]       
                }),      
                success: function (jsonData) { // Callback function when successful
                    viewAddmessage(jsonData); // Call VIEW function 
                },
                fail: function () {
                    alert("ERROR: Database connection failed.");
                },
                contentType: "application/json;charset=UTF-8",                  
            })   
        }
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
function editPermission(jsonData){
    $.post({
        url: 'api/updatePermission.php',
        data: jsonData,     
        success: function (jsonData) { // Callback function when successful
            viewMessageData(jsonData); // Call VIEW function
            //console.log('viewData') ;
        },
        fail: function () {
            alert("ERROR: Database connection failed.");
        },
        contentType: "application/json;charset=UTF-8",                  
    }).done(function(data){
        // tableData();
        //canEdit();
    })    
}
function viewMessageData(dataIn) {
    message = dataIn;
    if(message.code==0){
        alert(message.msg);
    }else if(message.code==2){
        alert(message.msg);
        reLogin();        
    }else{   
        alert("修改成功");
        location.reload();
    }
}
function viewData(){
    $.post({
        url: 'api/getPermission.php',
        data: JSON.stringify({      
            token: token
        }),      
        success: function (jsonData) { // Callback function when successful
            viewPermissionData(jsonData); // Call VIEW function
            //console.log('viewData') ;
        },
        fail: function () {
            alert("ERROR: Database connection failed.");
        },
        contentType: "application/json;charset=UTF-8",                  
    }).done(function(data){
        // tableData();
        //canEdit();
    })    
}
function viewPermissionData(jsonData){
    //console.log('showRole');
    permissionData = jsonData;
    if(permissionData.code==0){
        alert(permissionData.msg);
    }else if(permissionData.code==2){
        alert(permissionData.msg);
        reLogin();
    }else{
        if (!permissionData.data) {
            iLength = 0;
        } else {
            iLength = permissionData.data.length;
        }
        var trHead = document.createElement("thead");
        trHead.id = "tr_head";
        document.getElementById('tabledit').appendChild(trHead);
        var trItem = document.createElement("tr");
        //var thId = document.createElement("th");
        var thname = document.createElement("th");
        var thp01 = document.createElement("th");
        var thp02 = document.createElement("th");
        var thp03 = document.createElement("th");
        var thp04 = document.createElement("th");
        var thp05 = document.createElement("th");
        var thp06 = document.createElement("th");
        var thp07 = document.createElement("th");
        var thp08 = document.createElement("th");
        var thp09 = document.createElement("th");
        var thp10 = document.createElement("th");
        var thp11 = document.createElement("th");
        var thp12 = document.createElement("th");
        var thp13 = document.createElement("th");
        var thp14 = document.createElement("th");
        var thp15 = document.createElement("th");
        var thp16 = document.createElement("th");
        var thp17 = document.createElement("th");
        var thp18 = document.createElement("th");
        var thp19 = document.createElement("th");
        var thp20 = document.createElement("th");
        var thp21 = document.createElement("th");
        var thp22 = document.createElement("th");

        //thId.innerText = permissionData.data[0].ID;
        thname.innerText = permissionData.data[0].name;
        thp01.innerText = permissionData.data[0].p01;
        thp02.innerText = permissionData.data[0].p02;
        thp03.innerText = permissionData.data[0].p03;
        thp04.innerText = permissionData.data[0].p04;
        thp05.innerText = permissionData.data[0].p05;
        thp06.innerText = permissionData.data[0].p06;
        thp07.innerText = permissionData.data[0].p07;
        thp08.innerText = permissionData.data[0].p08;
        thp09.innerText = permissionData.data[0].p09;
        thp10.innerText = permissionData.data[0].p10;
        thp11.innerText = permissionData.data[0].p11;
        thp12.innerText = permissionData.data[0].p12;
        thp13.innerText = permissionData.data[0].p13;
        thp14.innerText = permissionData.data[0].p14;
        thp15.innerText = permissionData.data[0].p15;
        thp16.innerText = permissionData.data[0].p16;
        thp17.innerText = permissionData.data[0].p17;
        thp18.innerText = permissionData.data[0].p18;
        thp19.innerText = permissionData.data[0].p19;
        thp20.innerText = permissionData.data[0].p20;
        thp21.innerText = permissionData.data[0].p21;
        thp22.innerText = permissionData.data[0].p22;

        //thId.className = "sticky-col";
        thname.className = "sticky-col";

        //trItem.appendChild(thId);
        trItem.appendChild(thname);
        trItem.appendChild(thp01);
        trItem.appendChild(thp02);
        trItem.appendChild(thp03);
        trItem.appendChild(thp04);
        trItem.appendChild(thp05);
        trItem.appendChild(thp06);
        trItem.appendChild(thp07);
        trItem.appendChild(thp08);
        trItem.appendChild(thp09);
        trItem.appendChild(thp10);
        trItem.appendChild(thp11);
        trItem.appendChild(thp12);
        trItem.appendChild(thp13);
        trItem.appendChild(thp14);
        trItem.appendChild(thp15);
        trItem.appendChild(thp16);
        trItem.appendChild(thp17);
        trItem.appendChild(thp18);
        trItem.appendChild(thp19);
        trItem.appendChild(thp20);
        trItem.appendChild(thp21);
        trItem.appendChild(thp22);           
        document.getElementById('tr_head').appendChild(trItem);

        var tbody = document.createElement("tbody");
        tbody.id = "tablebody";
        document.getElementById('tabledit').appendChild(tbody);

        for(var i = 1;i<iLength;i++){
            var trItem = document.createElement("tr");
            //var tdId = document.createElement("td");
            var tdname = document.createElement("td");
            var tdp01 = document.createElement("td");
            var tdp02 = document.createElement("td");
            var tdp03 = document.createElement("td");
            var tdp04 = document.createElement("td");
            var tdp05 = document.createElement("td");
            var tdp06 = document.createElement("td");
            var tdp07 = document.createElement("td");
            var tdp08 = document.createElement("td");
            var tdp09 = document.createElement("td");
            var tdp10 = document.createElement("td");
            var tdp11 = document.createElement("td");
            var tdp12 = document.createElement("td");
            var tdp13 = document.createElement("td");
            var tdp14 = document.createElement("td");
            var tdp15 = document.createElement("td");
            var tdp16 = document.createElement("td");
            var tdp17 = document.createElement("td");
            var tdp18 = document.createElement("td");
            var tdp19 = document.createElement("td");
            var tdp20 = document.createElement("td");
            var tdp21 = document.createElement("td");
            var tdp22 = document.createElement("td");

            //tdId.innerText = permissionData.data[i].ID;
            tdname.innerText = permissionData.data[i].name;
            tdname.setAttribute("value", permissionData.data[i].ID);
            tdname.setAttribute("ID", i);
            //tdId.className = "sticky-col";
            tdname.className = "sticky-col";

            // 0 => 無權限, 1 => 有權限
            // 每一個block => 9個要改的
            var box1 = document.createElement("input");
            box1.setAttribute("type", "checkbox");
            box1.setAttribute("ID", i + "R" + 1);
            tdp01.appendChild(box1);           
            if(permissionData.data[i].p01 == "1"){
                box1.setAttribute("value", "1");
                box1.checked = true;
            }else{
                box1.setAttribute("value", "0");
                box1.checked = false;     
            }

            var box2 = document.createElement("input");
            box2.setAttribute("type", "checkbox");
            box2.setAttribute("ID", i + "R" + 2);
            tdp02.appendChild(box2);           
            if(permissionData.data[i].p02 == "1"){
                box2.setAttribute("value", "1");
                box2.checked = true;
            }else{
                box2.setAttribute("value", "0");
                box2.checked = false;     
            }

            var box3 = document.createElement("input");
            box3.setAttribute("type", "checkbox");
            box3.setAttribute("ID", i + "R" + 3);
            tdp03.appendChild(box3);           
            if(permissionData.data[i].p03 == "1"){
                box3.setAttribute("value", "1");
                box3.checked = true;
            }else{
                box3.setAttribute("value", "0");
                box3.checked = false;     
            }

            var box4 = document.createElement("input");
            box4.setAttribute("type", "checkbox");
            box4.setAttribute("ID", i + "R" + 4);
            tdp04.appendChild(box4);           
            if(permissionData.data[i].p04 == "1"){
                box4.setAttribute("value", "1");
                box4.checked = true;
            }else{
                box4.setAttribute("value", "0");
                box4.checked = false;     
            }

            var box5 = document.createElement("input");
            box5.setAttribute("type", "checkbox");
            box5.setAttribute("ID", i + "R" + 5);
            tdp05.appendChild(box5);           
            if(permissionData.data[i].p05 == "1"){
                box5.setAttribute("value", "1");
                box5.checked = true;
            }else{
                box5.setAttribute("value", "0");
                box5.checked = false;     
            }

            var box6 = document.createElement("input");
            box6.setAttribute("type", "checkbox");
            box6.setAttribute("ID", i + "R" + 6);
            tdp06.appendChild(box6);           
            if(permissionData.data[i].p06 == "1"){
                box6.setAttribute("value", "1");
                box6.checked = true;
            }else{
                box6.setAttribute("value", "0");
                box6.checked = false;     
            }

            var box7 = document.createElement("input");
            box7.setAttribute("type", "checkbox");
            box7.setAttribute("ID", i + "R" + 7);
            tdp07.appendChild(box7);           
            if(permissionData.data[i].p07 == "1"){
                box7.setAttribute("value", "1");
                box7.checked = true;
            }else{
                box7.setAttribute("value", "0");
                box7.checked = false;     
            }

            var box8 = document.createElement("input");
            box8.setAttribute("type", "checkbox");
            box8.setAttribute("ID", i + "R" + 8);
            tdp08.appendChild(box8);           
            if(permissionData.data[i].p08 == "1"){
                box8.setAttribute("value", "1");
                box8.checked = true;
            }else{
                box8.setAttribute("value", "0");
                box8.checked = false;     
            }

            var box9 = document.createElement("input");
            box9.setAttribute("type", "checkbox");
            box9.setAttribute("ID", i + "R" + 9);
            tdp09.appendChild(box9);           
            if(permissionData.data[i].p09 == "1"){
                box9.setAttribute("value", "1");
                box9.checked = true;
            }else{
                box9.setAttribute("value", "0");
                box9.checked = false;     
            }

            var box10 = document.createElement("input");
            box10.setAttribute("type", "checkbox");
            box10.setAttribute("ID", i + "R" + 10);
            tdp10.appendChild(box10);           
            if(permissionData.data[i].p10 == "1"){
                box10.setAttribute("value", "1");
                box10.checked = true;
            }else{
                box10.setAttribute("value", "0");
                box10.checked = false;     
            }

            var box11 = document.createElement("input");
            box11.setAttribute("type", "checkbox");
            box11.setAttribute("ID", i + "R" + 11);
            tdp11.appendChild(box11);           
            if(permissionData.data[i].p11 == "1"){
                box11.setAttribute("value", "1");
                box11.checked = true;
            }else{
                box11.setAttribute("value", "0");
                box11.checked = false;     
            }

            var box12 = document.createElement("input");
            box12.setAttribute("type", "checkbox");
            box12.setAttribute("ID", i + "R" + 12);
            tdp12.appendChild(box12);           
            if(permissionData.data[i].p12 == "1"){
                box12.setAttribute("value", "1");
                box12.checked = true;
            }else{
                box12.setAttribute("value", "0");
                box12.checked = false;     
            }

            var box13 = document.createElement("input");
            box13.setAttribute("type", "checkbox");
            box13.setAttribute("ID", i + "R" + 13);
            tdp13.appendChild(box13);           
            if(permissionData.data[i].p13 == "1"){
                box13.setAttribute("value", "1");
                box13.checked = true;
            }else{
                box13.setAttribute("value", "0");
                box13.checked = false;     
            }

            var box14 = document.createElement("input");
            box14.setAttribute("type", "checkbox");
            box14.setAttribute("ID", i + "R" + 14);
            tdp14.appendChild(box14);           
            if(permissionData.data[i].p14 == "1"){
                box14.setAttribute("value", "1");
                box14.checked = true;
            }else{
                box14.setAttribute("value", "0");
                box14.checked = false;     
            }

            var box15 = document.createElement("input");
            box15.setAttribute("type", "checkbox");
            box15.setAttribute("ID", i + "R" + 15);
            tdp15.appendChild(box15);           
            if(permissionData.data[i].p15 == "1"){
                box15.setAttribute("value", "1");
                box15.checked = true;
            }else{
                box15.setAttribute("value", "0");
                box15.checked = false;     
            }

            var box16 = document.createElement("input");
            box16.setAttribute("type", "checkbox");
            box16.setAttribute("ID", i + "R" + 16);
            tdp16.appendChild(box16);           
            if(permissionData.data[i].p16 == "1"){
                box16.setAttribute("value", "1");
                box16.checked = true;
            }else{
                box16.setAttribute("value", "0");
                box16.checked = false;     
            }

            var box17 = document.createElement("input");
            box17.setAttribute("type", "checkbox");
            box17.setAttribute("ID", i + "R" + 17);
            tdp17.appendChild(box17);           
            if(permissionData.data[i].p17 == "1"){
                box17.setAttribute("value", "1");
                box17.checked = true;
            }else{
                box17.setAttribute("value", "0");
                box17.checked = false;     
            }

            var box18 = document.createElement("input");
            box18.setAttribute("type", "checkbox");
            box18.setAttribute("ID", i + "R" + 18);
            tdp18.appendChild(box18);           
            if(permissionData.data[i].p18 == "1"){
                box18.setAttribute("value", "1");
                box18.checked = true;
            }else{
                box18.setAttribute("value", "0");
                box18.checked = false;     
            }

            var box19 = document.createElement("input");
            box19.setAttribute("type", "checkbox");
            box19.setAttribute("ID", i + "R" + 19);
            tdp19.appendChild(box19);           
            if(permissionData.data[i].p19 == "1"){
                box19.setAttribute("value", "1");
                box19.checked = true;
            }else{
                box19.setAttribute("value", "0");
                box19.checked = false;     
            }

            var box20 = document.createElement("input");
            box20.setAttribute("type", "checkbox");
            box20.setAttribute("ID", i + "R" + 20);
            tdp20.appendChild(box20);           
            if(permissionData.data[i].p20 == "1"){
                box20.setAttribute("value", "1");
                box20.checked = true;
            }else{
                box20.setAttribute("value", "0");
                box20.checked = false;     
            }

            var box21 = document.createElement("input");
            box21.setAttribute("type", "checkbox");
            box21.setAttribute("ID", i + "R" + 21);
            tdp21.appendChild(box21);           
            if(permissionData.data[i].p21 == "1"){
                box21.setAttribute("value", "1");
                box21.checked = true;
            }else{
                box21.setAttribute("value", "0");
                box21.checked = false;     
            }

            var box22 = document.createElement("input");
            box22.setAttribute("type", "checkbox");
            box22.setAttribute("ID", i + "R" + 22);
            tdp22.appendChild(box22);           
            if(permissionData.data[i].p22 == "1"){
                box22.setAttribute("value", "1");
                box22.checked = true;
            }else{
                box22.setAttribute("value", "0");
                box22.checked = false;     
            }            

            //trItem.appendChild(tdId);
            trItem.appendChild(tdname);
            trItem.appendChild(tdp01);
            trItem.appendChild(tdp02);
            trItem.appendChild(tdp03);
            trItem.appendChild(tdp04);
            trItem.appendChild(tdp05);
            trItem.appendChild(tdp06);
            trItem.appendChild(tdp07);
            trItem.appendChild(tdp08);
            trItem.appendChild(tdp09);
            trItem.appendChild(tdp10);
            trItem.appendChild(tdp11);
            trItem.appendChild(tdp12);
            trItem.appendChild(tdp13);
            trItem.appendChild(tdp14);
            trItem.appendChild(tdp15);
            trItem.appendChild(tdp16);
            trItem.appendChild(tdp17);
            trItem.appendChild(tdp18);
            trItem.appendChild(tdp19);
            trItem.appendChild(tdp20);
            trItem.appendChild(tdp21);
            trItem.appendChild(tdp22);           
            document.getElementById('tablebody').appendChild(trItem);                    
        }
    }
}     

/* hideAllContent */
function hideAllContent() {
    $("#lightBoxColumn").hide();
}