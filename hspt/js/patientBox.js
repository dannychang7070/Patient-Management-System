/* JS: patientBox */

globals: $:false; // Ignore JSLint/JSHint error: "$ is not defined"

/* Global vars */
var options;
var treatment_serial=-1;
var merchandise_serial=-1;
var treatment_flag=-1;
var merchandise_flag=-1;
var delete_treatment_flag = [];
var delete_merchandise_flag = [];
var dbData;
var dataOutCaseID;
var patientIDIn;
var departmentIDIn;
var dateOptionSelectedDate; //Date
var detailButtonClickedDepartmentID;
var dateOptionSelectedCaseHistoryID; //CaseHistoryID
var oldTreatmentRecords = [];
var newTreatmentRecords = [];
var oldGoodRecords = [];
var newGoodRecords = [];
var detailButtonClickedCaseID;
var token;

$(document).ready(function () {
    token = getCookie("token");
    /* Toggle light box */
    $(document).on('click', '.detailButtonLink', showPatientBox); // .detailButton CLICK
    $(document).on('click', '#lightBoxCloseButton', closePatientBox); // #lightBoxCloseButton CLICK
    $(document).keyup(keyBoardControl); // Detect keyboard control
    
    /* Handle date changes */
    $("#patientBoxDateSect").change(changeDate); // #patientBoxDateSect CHANGE
    
    /* Edit patient info */
    $(document).on('click', '#editPatientInfoButtonLink', editPatientInfo); // #editPatientInfoButton CLICK
    $(document).on('click', '#editPatientInfoOKButtonLink', updatePatientInfo); // #editPatientInfoOKButton CLICK
    $("#editPatientBoxTitleBirthYear, #editPatientBoxTitleBirthMonth").change(editPatientInfoDate); // #editPatientBoxTitleBirthYear and #editPatientBoxTitleBirthMonth CHANGE
    
    /* Edit patient history */
    //$(document).on('click', '#editPatientHistoryButtonLink', editRecord); // #editPatientHistoryButton CLICK
    $(document).on('click', '#deletePatientHistoryButtonLink', deleteRecord); // #deletePatientHistoryButtonLink CLICK
    //$(document).on('click', '#editPatientHistoryOKButtonLink', updateRecord); // #editPatientHistoryOKButton CLICK


    //button for add
    $(document).on('click', 'button.add', function (){
        var merchandiseSize_index = $(this).parent().parent().find('.merchandiseSize').prop('selectedIndex')-1;
        var merchandiseName_index = $(this).parent().parent().find('.merchandiseName').prop('selectedIndex')-1;

        if(merchandiseSize_index == -1){
            return;
        }
        var listItem = $(this).closest(".merchandiseCash");
        var counter = parseInt($(listItem).find(".quantity").val());
        counter++;
        $(listItem).find(".quantity").val(counter);     
        var unitPrice = $(listItem).find(".exact_cash").val() ? $(listItem).find(".exact_cash").val() : 0;

        $(listItem).find(".total").val(unitPrice * counter);

        var remaining_number = options.data.merchandise[merchandiseName_index].content[merchandiseSize_index].remaining;
        var default_number = $(this).parent().find('.quantity').val();
        var inventory_number = remaining_number-default_number;

        if (inventory_number < 0){
            $(this).parent().find('.inventory').text("預售"+Math.abs(inventory_number)+"件");
        }else{
            $(this).parent().find('.inventory').text("剩餘"+inventory_number+"件");
        }
        $(this).parent().find('.inventory').show();     

        updateShouldNumber();
        updateTotalNumber();
    });

    //button for minus
    $(document).on('click', 'button.minus', function(){ 
        var merchandiseSize_index = $(this).parent().parent().find('.merchandiseSize').prop('selectedIndex')-1;
        var merchandiseName_index = $(this).parent().parent().find('.merchandiseName').prop('selectedIndex')-1;
        if(merchandiseSize_index == -1){
            return;
        }
        var listItem = $(this).closest(".merchandiseCash");
        var counter = parseInt($(listItem).find(".quantity").val());
        counter--;
        if(counter<0){
            alert("數量不能小於0");
            return;
        }
        $(listItem).find(".quantity").val(counter);        
        var unitPrice = $(listItem).find(".exact_cash").val() ? $(listItem).find(".exact_cash").val() : 0;
        
        $(listItem).find(".total").val(unitPrice * counter);

        var remaining_number = options.data.merchandise[merchandiseName_index].content[merchandiseSize_index].remaining;
        var default_number = $(this).parent().find('.quantity').val();
        var inventory_number = remaining_number-default_number;

        if (inventory_number < 0){
            $(this).parent().find('.inventory').text("預售"+Math.abs(inventory_number)+"件");
        }else{
            $(this).parent().find('.inventory').text("剩餘"+inventory_number+"件");
        }
        $(this).parent().find('.inventory').show(); 

        updateShouldNumber();
        updateTotalNumber();
    });

    //當部位更動時，重新載入症狀下拉選單
    // Select one of part, then load its name
    $(document).on('change', '.partlist', function(){       
        var newDiseaseItem = document.getElementById('diseaseItemTemplate'); // Access diseaseItem template
        var partIndex = $(this).find("option:selected").val(); 
        //先去uncheck everyone, block everyone, and then clear money
        $(this).parent().find("input.treatmentset").prop('checked', false);     
        $(this).parent().find("input.treatmentset").prop('disabled', true);
        $(this).parent().find("input.money").val("");
        $(this).parent().find("input.exact_money").val("");               
        $(this).parent().find('.diseaselist option[value!="-1"]').remove();
        if(partIndex==-1){
            updateShouldNumber();
            updateTotalNumber();            
            return;
        }
        for(var k=0;k<options.data.disease[partIndex].content.length;k++){
            var contentName = options.data.disease[partIndex].content[k].name;
            var contentID = options.data.disease[partIndex].content[k].ID;
            newDiseaseItem.content.querySelector('.disease').id = $(this).parent().find('.partlist').find("option:selected").prop('id') + "_" +k + "newDiseaseSect"; 
            newDiseaseItem.content.querySelector('.disease').innerHTML = contentName;
            newDiseaseItem.content.querySelector('.disease').value = contentID;
            newDiseaseItem.content.querySelector('.disease').class = "newDiseaseSect";              
            $(this).parent().find('.diseaselist').append(newDiseaseItem.content.cloneNode(true));
        }
    });     

    //當部位+症狀選好後，邏輯:解除治療checkbox封印 但不是每個類型都可以選/ 要判斷有沒有部位+症狀+治療是相同的/ check後跳價錢(到這邊弄好了)
    $(document).on('change', '.diseaselist', function(){
        var diseaseValue= $(this).find("option:selected").val();
        var partValue = $(this).parent().find('.partlist').find("option:selected").val();
        var suffix = $(this).parent().attr('id').replace ( /[^\d.]/g, '' );
        var parse_suffix = parseInt(suffix);
        //先去uncheck everyone, block everyone, and then clear money
        $(this).parent().find("input.treatmentset").prop('checked', false);     
        $(this).parent().find("input.treatmentset").prop('disabled', true);
        $(this).parent().find("input.money").val("");
        $(this).parent().find("input.exact_money").val(""); 
        if(partValue==-1){
            updateShouldNumber();
            updateTotalNumber();
            return;
        }
        for(p=0; p<options.data.disease[partValue].content.length;p++){
            if(diseaseValue==options.data.disease[partValue].content[p].ID){
                for(r=0; r<options.data.disease[partValue].content[p].package.length;r++){
                    var treatmentType = options.data.disease[partValue].content[p].package[r].treatmentType;
                    for(q=0; q<options.data.treatment.length;q++){
                        if(options.data.treatment[q].typeID==treatmentType){
                            $(this).parent().parent().find("#"+parse_suffix+"_"+q+"newTherapy"+treatmentType).find("input.treatmentset").prop("disabled", false);
                        }
                    }
                }
            }
        }
        updateShouldNumber();
        updateTotalNumber();        

    });

    //TreamentSet做選一不再選
    $(document).on('change', 'input.treatmentset', function(){ 
        var parent_set = $(this).closest(".therapySectContent");
        var parent_set2 = $(this).closest(".therapy_group");
        var parent_set3 = $(this).closest(".therapylist");
        var parent_set4 = $(this).parent().parent().parent().parent();
        var diseaseValue= $(parent_set4).find(".diseaselist").find("option:selected").val();
        var partValue = $(parent_set4).find(".partlist").find("option:selected").val();
        var treatmentValue = parseInt($(this).parent().parent().attr("id"));
        var formId = parseInt($(parent_set4).attr('id').replace ( /[^\d.]/g, '' ));
        var flag = true;
        $(this).parent().parent().parent().parent().parent().children().each(function(){
            var partlistId = $(this).find(".partlist").find("option:selected").val();;
            var diseaseId = $(this).find(".diseaselist").find("option:selected").val();
            var therapylistId = $(this).find("input.treatmentset:checked").parent().parent().attr("id");
            var newformContentId = parseInt($(this).attr('id').replace ( /[^\d.]/g, '' ));
            if( partValue == partlistId && diseaseValue == diseaseId && treatmentValue == therapylistId && formId != newformContentId){
                flag = false;
                alert("請勿選擇重複部位,症狀和治療方式");
            }                   
        });

        if(flag){
            if ($(parent_set4).find(".therapylist").find("input.treatmentset:checked").length<=0) {
                $(parent_set4).find(".moneylist").find("input.money").val("");
                $(parent_set4).find(".moneylist").find("input.exact_money").val("");
                updateShouldNumber();
                updateTotalNumber();                
                return;             
            }
            for(p=0; p<options.data.disease[partValue].content.length;p++){
                if(diseaseValue == options.data.disease[partValue].content[p].ID){
                    for(r=0; r<options.data.disease[partValue].content[p].package.length;r++){
                        if( treatmentValue == options.data.disease[partValue].content[p].package[r].treatmentType){
                            var treatmentPrice = options.data.disease[partValue].content[p].package[r].price;
                            $(parent_set4).find(".money").val(treatmentPrice);
                            $(parent_set4).find(".exact_money").val(treatmentPrice);                        
                        }
                    }
                }
            }
        }else{
            //先去uncheck everyone, block everyone, and then clear money
            $(this).prop('checked', false);     
            $(this).parent().find("input.treatmentset").prop('disabled', true);
            $(parent_set4).find(".moneylist").find("input.money").val("");
            $(parent_set4).find(".moneylist").find("input.exact_money").val("");                            
        }
        $(parent_set3).find('.therapy_group').not(parent_set2).find('input.treatmentset').prop('checked', false); 
        updateShouldNumber();
        updateTotalNumber(); 
    });  

    //當商品更動時，重新載入規格下拉選單
    $(document).on('change', '.merchandiseName', function(){    
        var newMerchSizeItem = document.getElementById('merchandiseSizeItem'); // Access MerchSizeItem template     
        var merchandiseNameIndex = $(this).find("option:selected").val();
        $(this).parent().find('.merchandiseSize option[value!="-1"]').remove();
        // 先將exact_cash做預設
        $(this).parent().find('.merchandiseCash').find('.exact_cash').val(0);
        // 先將total做預設
        $(this).parent().find('.merchandiseCash').find('.total').val(0);                
        // 剩餘數量預設
        $(this).parent().find('.merchandiseCash').find('.inventory').text("剩餘 件");
        $(this).parent().find('.merchandiseCash').find('.inventory').hide();    
        if(merchandiseNameIndex==-1){
            updateShouldNumber();
            updateTotalNumber();
            return;
        }                                                
        for(k=0;k<options.data.merchandise[merchandiseNameIndex].content.length;k++){
            var contentSize = options.data.merchandise[merchandiseNameIndex].content[k].size;
            var contentID = options.data.merchandise[merchandiseNameIndex].content[k].ID;
            newMerchSizeItem.content.querySelector('.merchandiseSizeItem').id = $(this).parent().find('.merchandiseName').find("option:selected").prop('id') + "_" + contentID;
            newMerchSizeItem.content.querySelector('.merchandiseSizeItem').innerHTML = contentSize;
            newMerchSizeItem.content.querySelector('.merchandiseSizeItem').value = contentID;
            newMerchSizeItem.content.querySelector('.merchandiseSizeItem').class = "newMerchdiseSizeSect";              
            $(this).parent().find(".merchandiseSize").append(newMerchSizeItem.content.cloneNode(true));
        }
    });        

   //更新金額
    $(document).on('change', '.merchandiseSize', function(){  
        var merchandiseID = $(this).find("option:selected").val();
        var merchandiseIndex = parseInt($(this).closest(".newmerchContent").attr('id').replace ( /[^\d.]/g, '' ));      
        // 先將quantity做預設=1
        $(this).parent().find('.merchandiseCash').find('.quantity').val(1);         
        if(merchandiseID==-1){
            // 先將exact_cash做預設
            $(this).parent().find('.merchandiseCash').find('.exact_cash').val(0);
            // 先將total做預設
            $(this).parent().find('.merchandiseCash').find('.total').val(0);
            // 先將quantity做預設=1
            $(this).parent().find('.merchandiseCash').find('.quantity').val(1);                                
            // 剩餘數量預設
            $(this).parent().find('.merchandiseCash').find('.inventory').text("剩餘 件");
            $(this).parent().find('.merchandiseCash').find('.inventory').hide();
            updateShouldNumber();
            updateTotalNumber();            
            return;
        };
        var selectedHtmlID = $(this).prop('id');
        var flag = true;
        $(this).parent().parent().children().each(function(){
            var tempID = $(this).find(".merchandiseSize").find("option:selected").val();
            var tempHtmlID = $(this).find(".merchandiseSize").prop('id');           
            if(merchandiseID==tempID && selectedHtmlID != tempHtmlID){
                flag = false;
                alert("請勿選擇重複商品和尺寸");
            }
        });
        if(flag){
            // 先取得目前的價格與剩餘數量 直接更新到隱藏欄位 當不足數量時 會提醒不足幾件
            var first_index = $(this).parent().find('.merchandiseName').prop('selectedIndex')-1;
            var second_index = $(this).prop('selectedIndex')-1;
            // 先將exact_cash做預設
            $(this).parent().find('.merchandiseCash').find('.exact_cash').val(0);
            if(first_index==-1) return;
            if(second_index==-1) return;
            if(first_index >= 0 && second_index >= 0){
                $(this).parent().find('.merchandiseCash').find('.exact_cash').val(options.data.merchandise[first_index].content[second_index].price);
                $(this).parent().find('.merchandiseCash').find('.total').val(options.data.merchandise[first_index].content[second_index].price);                 
            }else{
                $(this).parent().find('.merchandiseCash').find('.exact_cash').val(0);
                $(this).parent().find('.merchandiseCash').find('.total').val(0);                    
                $(this).parent().find('.merchandiseCash').find('.inventory').hide();                    
            }
            var remaining_number = options.data.merchandise[first_index].content[second_index].remaining;
            var default_number = $(this).parent().find('.merchandiseCash').find('.quantity').val();
            var inventory_number = remaining_number-default_number;
            if (inventory_number < 0){
                $(this).parent().find('.merchandiseCash').find('.inventory').text("預售"+Math.abs(inventory_number)+"件");
            }else{
                $(this).parent().find('.merchandiseCash').find('.inventory').text("剩餘"+inventory_number+"件");
            }
            $(this).parent().find('.merchandiseCash').find('.inventory').show();
        }else{              
            var newMerchSizeItem = document.getElementById('merchandiseSizeItem'); // Access MerchSizeItem template     
            var merchandiseNameIndex = $(this).parent().find(".merchandiseName").find("option:selected").val();
            $(this).find('option[value!="-1"]').remove();
            // 先將exact_cash做預設
            $(this).parent().find('.merchandiseCash').find('.exact_cash').val(0);
            // 先將total做預設
            $(this).parent().find('.merchandiseCash').find('.total').val(0);                
            // 剩餘數量預設
            $(this).parent().find('.merchandiseCash').find('.inventory').text("剩餘 件");
            $(this).parent().find('.merchandiseCash').find('.inventory').hide();                                
            for(k=0;k<options.data.merchandise[merchandiseNameIndex].content.length;k++){
                var contentSize = options.data.merchandise[merchandiseNameIndex].content[k].size;
                var contentID = options.data.merchandise[merchandiseNameIndex].content[k].ID;
                newMerchSizeItem.content.querySelector('.merchandiseSizeItem').id = $(this).parent().find('.merchandiseName').find("option:selected").prop('id') + "_" + contentID;
                newMerchSizeItem.content.querySelector('.merchandiseSizeItem').innerHTML = contentSize;
                newMerchSizeItem.content.querySelector('.merchandiseSizeItem').value = contentID;
                newMerchSizeItem.content.querySelector('.merchandiseSizeItem').class = "newMerchdiseSizeSect";              
                $(this).parent().find(".merchandiseSize").append(newMerchSizeItem.content.cloneNode(true));
            }               
        }
        updateShouldNumber();
        updateTotalNumber();
   });

    //新增商品button 到這邊
    $(document).on('click', '#add_merchandise', function(){ 
        merchandise_serial++;   
        merchandise_template(); 
        /* Merchandise */
        $(".goodItemName").hide();        
        $(".goodItemSize").hide();
        $(".goodItemQuantityInput").hide();
        $(".goodItemPriceInput").hide();
        $(".goodItemQuantityBlock").width(134);
        $(".goodItemQuantityBlock").css('border', 'none');
        $(".goodItemMinusButton").show();
        $(".goodItemMinusButton").width(20);
        $(".editGoodItemQuantityInput").show();
        $(".editGoodItemName").show();
        $(".editGoodItemSize").show();
        $(".editGoodItemQuantityInput").width(50);
        $(".goodItemPlusButton").show();
        $(".goodItemPlusButton").width(20);
        $(".editGoodItemPriceInput").show();
        $(".editGoodItemPriceInput").width(50);
        $(".delete").show();
        $(".merchandiseCash").show();           
    });

    //新增診療內容button
    $(document).on('click', '#add_treatment', function(){   
        treatment_serial++; 
        treatment_template();
        /* Treatment */
        $(".examItemTitleBody").hide();
        $(".examItemTitleDisease").hide();
        $(".examItemTreatment").hide();
        $(".examItemPrice").hide();
        $(".examItemPriceLabel").hide();
        $(".editExamItemTitleBody").show();
        $(".editExamItemTitleDisease").show();
        $(".editExamItemTreatment").show();
        $(".editExamItemPrice").show();
        $(".editGoodItemName").show();
        $(".editGoodItemSize").show();     
        $(".delete").show();
    });

    //Delete an existing task (treatment)
    $(document).on('click', 'button.delete_treatment', function(){  
        var listItem = this.parentNode;
        var div = listItem.parentNode;
        var deleteTreatmentID = parseInt($(this).attr('value').replace ( /[^\d.]/g, '' ));

        //Remove the parent list item from the div   
        // listItem.style.visibility = "hidden";       
        div.removeChild(listItem);
        updateShouldNumber();
        updateTotalNumber();      

        //Delete will affect newTreatmentRecords[] 
        newTreatmentRecords_delete(deleteTreatmentID);
    });

    //Delete an existing task (good)
    $(document).on('click', 'button.delete_good', function(){        
        var listItem = this.parentNode;
        var div = listItem.parentNode;
        var deleteGoodID = parseInt($(this).attr('value').replace ( /[^\d.]/g, '' ));

        //Remove the parent list item from the div   
        // listItem.style.visibility = "hidden";       
        div.removeChild(listItem);
        updateShouldNumber();
        updateTotalNumber();     
        //Delete will affect newGoodRecords[]   
        newMerchandiseRecords_delete(deleteGoodID);
    });    

    //只要有Keyup在價錢欄位 都要更新實收金額
    $(document).on('keyup', 'input.money', function(){      
        updateTotalNumber();        
    }); 
    $(document).on('keyup', 'input.total', function(){      
        updateTotalNumber();        
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

/* Show patient light box */
function showPatientBox() {
    var detailButtonClicked = $(this).attr("value").split(',');
    detailButtonClickedCaseID = detailButtonClicked[0]; // department_patientID
    detailButtonClickedDepartmentID = detailButtonClicked[1]; // departmentID

    askCaseDateData(detailButtonClickedCaseID, detailButtonClickedDepartmentID);
    
    //showFirstDate(); // Load data of the first date by default
}

/* Close patient light box */
function closePatientBox() {
    togglePatientInfoEditMode("off");
    toggleRecordEditMode("off");
    $("#patientTableBlock").hide(); 
    $("#patientNoteTextArea").hide();
    $("#deletePatientHistoryButtonLink").hide();
    $("#lightBoxColumn").fadeOut(300, function () {
        resetPatient(); // Reset patient info and date
        resetExamGoodPrice(); // Reset exam, good, and price
    });
}

/* Show first date option value */
function showFirstDate() {
    // SHOW FIRST CHILD VALUE
    var test1 = document.getElementById("patientBoxDateSect");
    if (test1.innerHTML != "") {
        alert(test1.firstChild.value);
        $("#lightBoxColumn").fadeIn(200);

    } else {
        $("#lightBoxColumn").fadeIn(200);
        alert("NO CHILD");
    } 
}

/* Change date */
function changeDate() {

    var dateOptionSelected = $("#patientBoxDateSect").val().split(',');
    dateOptionSelectedDate = dateOptionSelected[0]; // date
    dateOptionSelectedDepartmentPatientID = parseInt(dateOptionSelected[2]); // caseHistory_ID
    dateOptionSelectedCaseHistoryID = parseInt(dateOptionSelected[1]); // caseHistory_ID

    resetExamGoodPrice(); // Reset exam, good, and price
    $("#patientTableBlock").show(); 
    $("#patientNoteTextArea") .show();
    askExamGoodData(dateOptionSelectedDate, dateOptionSelectedCaseHistoryID, dateOptionSelectedDepartmentPatientID); // Access examItem
}

/* API: date data */
function askCaseDateData(dataOutCaseID, dataOutDepartmentID) {
    $.post({
        url: "api/getAllCaseDate.php", // URL of API
        data: JSON.stringify({

            // User
            // account: "admin",
            token: token,
            
            // Request
            department_patientID: dataOutCaseID,
            departmentID: dataOutDepartmentID,           
        }),
        success: function (jsonData) { // Callback function when successful
            showCaseDateData(jsonData, dataOutCaseID); // Call VIEW function 
            $("#lightBoxColumn").fadeIn(200);
        },
        error: function (data, status) {
            console.error("ERROR: Database connection failed." + status + ": " + JSON.stringify(data));
        },
        contentType: "application/json;charset=UTF-8",
        cache: false
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
function showCaseDateData(dataInJSON, dataInCaseID) {
    var dbData = dataInJSON;
    dataOutCaseID = dataInCaseID;
    $("#patientBoxTitleCaseID").html("#"+dataInCaseID);
    if(dbData.code==2){
        alert(dbData.msg);
        reLogin();
    }else{
        if(dbData.data.patientsData.name){
            $("#patientBoxTitleName").html(dbData.data.patientsData.name);
            $("#patientBoxTitleName").val(dbData.data.patientsData.name);
        }
        if(dbData.data.patientsData.gender){
            $("#patientBoxTitleSex").html(dbData.data.patientsData.gender+" /");
            $("#patientBoxTitleSex").val(dbData.data.patientsData.gender);
        }
        if(dbData.data.patientsData.gender){
            $("#patientBoxTitleBirth").html(dbData.data.patientsData.birthday+"生");
            $("#patientBoxTitleBirth").val(dbData.data.patientsData.birthday);
        }
        if(dbData.data.patientsData.phone1){
            $("#patientBoxTitlePhone1").html(dbData.data.patientsData.phone1);
            $("#patientBoxTitlePhone1").val(dbData.data.patientsData.phone1);
        }
        if(dbData.data.patientsData.phone2){
            $("#patientBoxTitlePhone2").html("/ "+dbData.data.patientsData.phone2);
            $("#patientBoxTitlePhone2").val(dbData.data.patientsData.phone2);
        }
        if(dbData.data.patientsData.address){
            $("#patientBoxTitleAddress").html("/ "+dbData.data.patientsData.address);
            $("#patientBoxTitleAddress").val(dbData.data.patientsData.address);
        }    
        if(dbData.data.patientsData.note){
            $("#patientBoxTitleNote").html("/ "+dbData.data.patientsData.note);
            $("#patientBoxTitleNote").val(dbData.data.patientsData.note);
        }           
        var iLength = dbData.data.case ? dbData.data.case.length : 0; // Handle !data situation 
        // patientBoxDate 
        for (var i=0 ; i<iLength ; i++){
            var newDateOption = document.getElementById('dateOptionTemplate'); // Access dateOptionTemplate template        
            
            newDateOption.content.querySelector('.dateOption').value = dbData.data.case[i].date+","+dbData.data.case[i].caseHistory_ID+","+dataOutCaseID;       
            newDateOption.content.querySelector('.dateOption').innerHTML = dbData.data.case[i].date;       

            /* Clone and show the new dateOption */
            document.getElementById('patientBoxDateSect').appendChild(newDateOption.content.cloneNode(true));
        }        
    }
}

/* API: exam data */
function askExamGoodData(dataOutDate, dataOutCaseHistoryID, dataOutPatientID) {
    dataOutDate = dataOutDate;
    dataOutCaseHistoryID = dataOutCaseHistoryID;
    options = JSON.parse(askOptions(dataOutPatientID, 1));

    $.post({
        url: "api/getCaseByDate.php", // URL of API
        data: JSON.stringify({
            // User
            // account:"admin",
            token: token,
            // Request
            date: dataOutDate,
            caseHistory_ID: dataOutCaseHistoryID,
            departmentID: detailButtonClickedDepartmentID
        }),
        success: function (jsonData) { // Callback function when successful
            showExamGoodData(jsonData, options); // Call VIEW function 
        },
        error: function () {
            alert("ERROR: Database connection failed.");
        },
        contentType: "application/json;charset=UTF-8",
    });
}

function showExamGoodData(dataIn) {
    var dbData = dataIn;
    var iLength = 0;
    var chargeTotalPrice = 0;
    var priceTotalPrice = 0;  
    /* Handle edit auth */
    // if(dbData.data.canEdit == false) {
    //     $("#editPatientHistoryButtonLink").hide();
    // }
    if(dbData.code==2){
        alert(dbData.msg);
        reLogin();
    }else{
        /* Handle !data situation */
        if (!dbData.data.record) {
            iLength = 0;
        } else {
            iLength = dbData.data.record.length;
        }
        $("#deletePatientHistoryButtonLink").show();
        document.getElementById("patientNoteTextArea").innerHTML = dbData.data.note;
        for (var i=0 ; i<iLength ; i++){ 
            //這是更新版本 只有Table形式
            var newTableRow = "<tr><th scope='row'>"+dbData.data.record[i].type+"</th>";
            newTableRow += "<td>"+dbData.data.record[i].title+"</td>";    
            newTableRow += "<td>"+dbData.data.record[i].detail+"</td>"; 
            newTableRow += "<td>"+dbData.data.record[i].amount+"</td>";
            newTableRow += "<td>"+dbData.data.record[i].charge+"</td></tr>";  
            
            document.getElementById("patientTable").innerHTML += newTableRow;  
            // Accumulate price of each item for subtotal 
            chargeTotalPrice += parseInt(dbData.data.record[i].charge, 10);
            priceTotalPrice += parseInt(dbData.data.record[i].price, 10);
        }     
    }     
    /* Show subtotal and total price */
    document.getElementById('patientBoxTotalPrice').innerHTML = "費用總計： "+chargeTotalPrice+" 元 (定價： "+ priceTotalPrice +" 元)";
    $(".inventory").hide();        
}
//Out of date
function showExamGoodDataDisabled(dataIn) {
    var dbData = dataIn;
    var iLength = 0;
    var jLength = 0;
    var examSectTotalPrice = 0;
    var goodSectTotalPrice = 0;    
    var newExamItem = document.getElementById('examItemTemplate'); // Access examItemTemplate
    var newGoodItem = document.getElementById('goodItemTemplate'); // Access goodItemTemplate
    var newOption = document.getElementById('partItemTemplate');
    var newTherapyItem = document.getElementById('therapyItemTemplate'); // Access therapyItem template 
    var newTreatmentItem = document.getElementById('treatmentItemTemplate'); // Access treatmentItem template
    var newMerchandiseItem = document.getElementById('merchandiseNameItem'); // Access treatmentItem template  merchandiseNameItem

    /* Handle edit auth */
    // if(dbData.data.canEdit == false) {
    //     $("#editPatientHistoryButtonLink").hide();
    // }
    if(dbData.code==2){
        alert(dbData.msg);
        reLogin();
    }else{
        /* Handle !data situation */
        if (!dbData.data.caseTreatment) {
            iLength = 0;
        } else {
            iLength = dbData.data.caseTreatment.length;
        }
        
        if (!dbData.data.caseMerchandise) {
            jLength = 0;
        } else {
            jLength = dbData.data.caseMerchandise.length;
        }

        //這是給計算總價用的, total_number是實收,should_number是應收       
        var should_number = 0;
        /* Show examItem in patientBoxExamSect */
        for (var i=0 ; i<iLength ; i++){ 
            /* Record ID to the global array */
            treatment_serial = i;        
            treatment_template();         
            var diseaseID = dbData.data.caseTreatment[i].diseaseID;
            var text = [];
            disease_preselect(treatment_serial, diseaseID);
            //Start to push init_data into oldTreatmentRecords[]
            var treatmentObject = {};
            treatmentObject["diseaseID"] = dbData.data.caseTreatment[i].diseaseID;
            treatmentObject["packetageID"] = dbData.data.caseTreatment[i].packetageID;
            treatmentObject["price"] = dbData.data.caseTreatment[i].price;
            treatmentObject["charge"] = dbData.data.caseTreatment[i].charge;
            var treatmentSelected = [];
            //Start to push init_data into newTreatmentRecord[]
            var treatmentObject2 = {};
            treatmentObject2["diseaseID"] = dbData.data.caseTreatment[i].diseaseID;
            treatmentObject2["packetageID"] = dbData.data.caseTreatment[i].packetageID;
            treatmentObject2["price"] = dbData.data.caseTreatment[i].price;
            treatmentObject2["charge"] = dbData.data.caseTreatment[i].charge;
            var treatmentSelected2 = [];        
            for(var j=0;j<dbData.data.caseTreatment[i].treatment.length;j++){  
                var treatmentID = dbData.data.caseTreatment[i].treatment[j].treatmentID;
                text = disease_preselect_front(treatment_serial, diseaseID, treatmentID, dbData, text, j);
                treatment_preselect(treatment_serial, diseaseID, treatmentID);
                //Start to push init_data into oldTreatmentRecords[]
                var single = {};
                single["ID"] = dbData.data.caseTreatment[i].treatment[j].ID;
                single["treatmentID"] = dbData.data.caseTreatment[i].treatment[j].treatmentID;
                treatmentSelected.push(single);
                //Start to push init_data into newTreatmentRecord[]
                var single2 = {};
                single2["ID"] = dbData.data.caseTreatment[i].treatment[j].ID;
                single2["treatmentID"] = dbData.data.caseTreatment[i].treatment[j].treatmentID;
                single2["isDelete"] = 0;
                treatmentSelected2.push(single2);            
            }
            //這是更新版本 只有Table形式
            var newTableRow = "<tr><th scope='row'>診療</th>";
            newTableRow += "<td>"+text[0]+"-"+text[1]+"</td>";    
            newTableRow += "<td>"+text[2]+"</td>"; 
            newTableRow += "<td>1</td>";
            newTableRow += "<td>"+dbData.data.caseTreatment[i].charge+"</td></tr>";  
            document.getElementById("patientTable").innerHTML += newTableRow;  

            document.getElementById('TherapySect['+i+']').innerHTML = text[2]; 
            document.getElementById(i+'newMoney').value = dbData.data.caseTreatment[i].charge;
            document.getElementById(i+'newHiddenMoney').value = dbData.data.caseTreatment[i].price;
            document.getElementById("newDeleteSect[" + treatment_serial + "]").className += " deleteDiseaseOriginal"; 

            // Accumulate price of each item for subtotal 
            examSectTotalPrice += parseInt(dbData.data.caseTreatment[i].charge, 10);
            //Start to push init_data into oldTreatmentRecords[]
            treatmentObject["treatment"] = treatmentSelected;
            oldTreatmentRecords.push(treatmentObject);        
            //Start to push init_data into newTreatmentRecord[]
            treatmentObject2["treatment"] = treatmentSelected2;
            newTreatmentRecords.push(treatmentObject2);

            //Disable Select
            document.getElementById('newPartSect['+i+']').disabled = true;
            document.getElementById('newDiseaseSect['+i+']').disabled = true; 
            $("#"+i+"newMoney").attr('readonly','readonly');        
        }
        for (var j=0 ; j<jLength ; j++){
            /* Record ID to the global array */
            merchandise_serial = j;
            merchandise_template();
            document.getElementById(merchandise_serial + "newmerchDelete").className += " deleteGoodOriginal"; 
            var goodID = dbData.data.caseMerchandise[j].merchandiseID;
            merchandise_preselect_front(merchandise_serial, goodID, dbData);
            //This function bring value and setting into Merchandise
            merchandise_preselect(merchandise_serial,goodID);       
            document.getElementById(j+'newQuant').value = dbData.data.caseMerchandise[j].amount;
            document.getElementById(j+'newTotal').value = dbData.data.caseMerchandise[j].charge;        
            /* Accumulate price of each item for subtotal */
            goodSectTotalPrice += parseInt(dbData.data.caseMerchandise[j].charge, 10);
            //Start to push init_data into oldGoodRecords
            var  merchandiseObject = {};
            merchandiseObject["ID"] = dbData.data.caseMerchandise[j].ID;
            merchandiseObject["merchandiseID"] = dbData.data.caseMerchandise[j].merchandiseID;
            merchandiseObject["amount"] = dbData.data.caseMerchandise[j].amount;
            merchandiseObject["price"] = dbData.data.caseMerchandise[j].price;
            merchandiseObject["charge"] = dbData.data.caseMerchandise[j].charge;
            oldGoodRecords.push(merchandiseObject);        

            //Start to push init_data into newGoodRecords
            var  merchandiseObject2 = {};
            merchandiseObject2["ID"] = dbData.data.caseMerchandise[j].ID;
            merchandiseObject2["merchandiseID"] = dbData.data.caseMerchandise[j].merchandiseID;
            merchandiseObject2["amount"] = dbData.data.caseMerchandise[j].amount;
            merchandiseObject2["price"] = dbData.data.caseMerchandise[j].price;
            merchandiseObject2["charge"] = dbData.data.caseMerchandise[j].charge;
            merchandiseObject2["delete"] = 0;
            newGoodRecords.push(merchandiseObject2); 

            //Disable Select
            document.getElementById(j+'merchandiseName').disabled = true;
            document.getElementById(j+'merchandiseSize').disabled = true;
            $("#"+j+"addmerchandisePrice").attr('disabled','disabled'); 
            $("#"+j+"minusmerchandisePrice").attr('disabled','disabled'); 
            $("#"+j+"newTotal").attr('readonly','readonly');        
        }
        
        /* Show subtotal and total price */
        document.getElementById('patientBoxExamPrice').innerHTML = "("+examSectTotalPrice+"元)";
        document.getElementById('patientBoxGoodPrice').innerHTML = "("+goodSectTotalPrice+"元)";
        document.getElementById('patientBoxTotalPrice').innerHTML = "費用總計 "+(examSectTotalPrice+goodSectTotalPrice)+" 元";
        $(".inventory").hide();    
        updateShouldNumber();
        updateTotalNumber(); 
        //Flag Setting
        treatment_flag = treatment_serial;
        merchandise_flag = merchandise_serial;
    }
}

//Preselect Treatment
function treatment_preselect(i,data1,data2){
    for(var j=0;j<options.data.disease.length;j++){
        for(var k=0;k<options.data.disease[j].content.length;k++){
            if(options.data.disease[j].content[k].ID==data1){                        
                for(var m=0;m<options.data.disease[j].content[k].package.length;m++){
                    var treatmentType = options.data.disease[j].content[k].package[m].treatmentType;
                    for(var n=0;n<options.data.treatment[treatmentType-1].content.length;n++){
                        var treatmentTypeID = options.data.treatment[treatmentType-1].typeID-1;
                        if(options.data.treatment[treatmentType-1].content[n].ID==data2){                           
                            $('input#'+i+'_'+treatmentTypeID+'_'+n+'newTreatmentCheck').prop('checked', true);
                            $('input#'+i+'_'+treatmentTypeID+'_'+n+'newTreatmentCheck').change(); 
                        }
                        $('input#'+i+'_'+treatmentTypeID+'_'+n+'newTreatmentCheck').prop("disabled","disabled"); 
                    }
                }
            }
        }
    }
}

//Preselect front Merchandise
function merchandise_preselect_front(i,data, dbData){
    for(var z=0;z<options.data.merchandise.length;z++){
        for(var k=0;k<options.data.merchandise[z].content.length;k++){                           
            if(options.data.merchandise[z].content[k].ID==data){
                var text1 = options.data.merchandise[z].name;
                var text2 = options.data.merchandise[z].content[k].size;
                document.getElementById(i+'viewmerchandiseName').innerHTML = options.data.merchandise[z].name;
                document.getElementById(i+'viewmerchandiseSize').innerHTML = options.data.merchandise[z].content[k].size;
            }
        }                   
    }       
     
    document.getElementById(i+'viewmerchandiseQuantity').innerHTML = dbData.data.caseMerchandise[i].amount;
    document.getElementById(i+'viewmerchandisePrice').innerHTML = dbData.data.caseMerchandise[i].charge; 
    //這是更新版本 只有Table形式
    var newTableRow = "<tr><th scope='row'>商品</th>";
    newTableRow += "<td>"+text1+"</td>";    
    newTableRow += "<td>"+text2+"</td>"; 
    newTableRow += "<td>"+dbData.data.caseMerchandise[i].amount+"</td>";
    newTableRow += "<td>"+dbData.data.caseMerchandise[i].charge+"</td></tr>"; 
    document.getElementById("patientTable").innerHTML += newTableRow;   
}
//Preselect Merchandise
function merchandise_preselect(i,data){
    for(var j=0;j<options.data.merchandise.length;j++){
        for(var k=0;k<options.data.merchandise[j].content.length;k++){                           
            if(options.data.merchandise[j].content[k].ID==data){
                $( '#'+i+'newmerchContent > select.merchandiseName > option#'+i+'_'+j+'newMerchdiseNameSect').prop('selected', true);
                $merchandiseName = document.getElementById(i+'merchandiseName');
                $($merchandiseName).change();               
                $( '#'+i+'newmerchContent > select.merchandiseSize > option#'+i+'_'+j+'newMerchdiseNameSect_'+data).prop('selected', true); 
                $merchandiseSize = document.getElementById(i+'merchandiseSize');
                $($merchandiseSize).change();
            }
        }       
    }   
}

//Preselect Disease
function disease_preselect(i,data1){
    for(var j=0;j<options.data.disease.length;j++){
        for(var k=0;k<options.data.disease[j].content.length;k++){
            if(options.data.disease[j].content[k].ID==data1){
                $('option#'+i+'_'+j+'newPartSect').prop('selected', true);
                //需要指定ID取得要change的元件，否則會導致畫面上class=partlist的元件全部都被呼叫到
                $partlist = document.getElementById('newPartSect['+i+']');
                $($partlist).change();
                $('option#'+i+'_'+j+'newPartSect_'+k+'newDiseaseSect').prop('selected', true);
                $diseaselist = document.getElementById('newDiseaseSect['+i+']');
                $($diseaselist).change();                                          
            }
        }
    }    
}

//Preselect front Disease
function disease_preselect_front(i,data1, data2, dbData, text, j){
    //價錢                  
    document.getElementById('MoneySect['+i+']').innerHTML = dbData.data.caseTreatment[i].charge; 
    for(var p=0;p<options.data.disease.length;p++){
        for(var k=0;k<options.data.disease[p].content.length;k++){
            if(options.data.disease[p].content[k].ID==data1){
                document.getElementById('PartSect['+i+']').innerHTML = options.data.disease[p].part;     
                var item1 = options.data.disease[p].part;       
                for(var m=0;m<options.data.disease[p].content[k].package.length;m++){
                    var treatmentType = options.data.disease[p].content[k].package[m].treatmentType;
                    document.getElementById('DiseaseSect['+i+']').innerHTML = options.data.disease[p].content[k].name; 
                    var item2 = options.data.disease[p].content[k].name;  
                    for(var n=0;n<options.data.treatment[treatmentType-1].content.length;n++){
                        var treatmentTypeID = options.data.treatment[treatmentType-1].typeID-1;
                        if(options.data.treatment[treatmentType-1].content[n].ID==data2){
                            var text1 = options.data.treatment[treatmentType-1].typeName+"-"+options.data.treatment[treatmentType-1].content[n].name;
                            if(j<dbData.data.caseTreatment[i].treatment.length-1){
                                text1 = text1 + " | ";
                            }      
                            var item3 = text1;  
                            text.push(item1);
                            text.push(item2);
                            text.push(item3);                                                                                                                   
                            return text;
                        }
                    }
                }                        
            }
        }
    }
}

//Merchandise Template
function merchandise_template(){
    var newGoodItem = document.getElementById('goodItemTemplate'); // Access goodItemTemplate
    var newMerchandiseItem = document.getElementById('merchandiseNameItem'); // Access treatmentItem template    
    newGoodItem.content.querySelector('.newmerchContent').id = merchandise_serial + "newmerchContent";
    newGoodItem.content.querySelector('.delete_good').value = merchandise_serial;
    newGoodItem.content.querySelector('.delete_good').id = merchandise_serial + "newmerchDelete";
    newGoodItem.content.querySelector('.merchandiseName').id = merchandise_serial + "merchandiseName";
    newGoodItem.content.querySelector('.merchandiseSize').id = merchandise_serial + "merchandiseSize";         
    newGoodItem.content.querySelector('.merchandiseCash').id = merchandise_serial + "merchandiseCash"; 
    newGoodItem.content.querySelector('.goodItemName').id = merchandise_serial + "viewmerchandiseName";
    newGoodItem.content.querySelector('.goodItemSize').id = merchandise_serial + "viewmerchandiseSize";         
    newGoodItem.content.querySelector('.goodItemQuantityInput').id = merchandise_serial + "viewmerchandiseQuantity";  
    newGoodItem.content.querySelector('.goodItemPriceInput').id = merchandise_serial + "viewmerchandisePrice";
    newGoodItem.content.querySelector('.goodItemPlusButton').id = merchandise_serial + "addmerchandisePrice";
    newGoodItem.content.querySelector('.goodItemMinusButton').id = merchandise_serial + "minusmerchandisePrice";                                                               
    newGoodItem.content.querySelector('.quantity').id =  merchandise_serial + "newQuant";
    newGoodItem.content.querySelector('.quantity').class = "newQuant";                                  
    newGoodItem.content.querySelector('.total').id = merchandise_serial + "newTotal";
    newGoodItem.content.querySelector('.total').class = "newTotal";         
    newGoodItem.content.querySelector('.exact_cash').id =  merchandise_serial + "newExactCash";
    newGoodItem.content.querySelector('.exact_cash').class = "newExactCash";    
    document.getElementById('patientBoxGoodSect').appendChild(newGoodItem.content.cloneNode(true));    
    for(j=0;j<options.data.merchandise.length;j++){                          
        var merchName = options.data.merchandise[j].name;
        newMerchandiseItem.content.querySelector('.merchandiseNameItem').id = merchandise_serial +'_'+ j + "newMerchdiseNameSect";
        newMerchandiseItem.content.querySelector('.merchandiseNameItem').class = "newMerchdiseNameSect";              
        newMerchandiseItem.content.querySelector('.merchandiseNameItem').innerHTML = merchName;
        newMerchandiseItem.content.querySelector('.merchandiseNameItem').value = j;  
        document.getElementById(merchandise_serial + "merchandiseName").appendChild(newMerchandiseItem.content.cloneNode(true));                  
    }     

}

//Treatment Template
function treatment_template(){
    var newExamItem = document.getElementById('examItemTemplate'); // Access examItemTemplate    
    var newOption = document.getElementById('partItemTemplate');
    var newTherapyItem = document.getElementById('therapyItemTemplate'); // Access therapyItem template 
    var newTreatmentItem = document.getElementById('treatmentItemTemplate'); // Access treatmentItem template 
    
    newExamItem.content.querySelector('.newformContent').id = "newFormSect[" + treatment_serial + "]";    
    newExamItem.content.querySelector('.delete_treatment').value = treatment_serial;
    newExamItem.content.querySelector('.delete_treatment').id = "newDeleteSect[" + treatment_serial + "]";
    newExamItem.content.querySelector('.editExamItemTitleBody').id = "newPartSect[" + treatment_serial + "]";
    newExamItem.content.querySelector('.editExamItemTitleDisease').id = "newDiseaseSect[" + treatment_serial + "]";
    newExamItem.content.querySelector('.editExamItemTreatment').id = "newTherapySect[" + treatment_serial + "]"; 
    newExamItem.content.querySelector('.editExamItemPrice').id = "newMoneySect[" + treatment_serial + "]";
    newExamItem.content.querySelector('.examItemTitleBody').id = "PartSect[" + treatment_serial + "]";
    newExamItem.content.querySelector('.examItemTitleDisease').id = "DiseaseSect[" + treatment_serial + "]";
    newExamItem.content.querySelector('.examItemTreatment').id = "TherapySect[" + treatment_serial + "]"; 
    newExamItem.content.querySelector('.examItemPrice').id = "MoneySect[" + treatment_serial + "]";
    newExamItem.content.querySelector('.money').id = treatment_serial + "newMoney";
    newExamItem.content.querySelector('.exact_money').id = treatment_serial + "newHiddenMoney";
    newExamItem.content.querySelector('.exact_money').type = "hidden";       
    // Clone and show the new examItem 
    document.getElementById('patientBoxExamSect').appendChild(newExamItem.content.cloneNode(true));
    for(var j=0;j<options.data.disease.length;j++){
        var partName = options.data.disease[j].part;
        newOption.content.querySelector('.part').id = treatment_serial + "_" + j + "newPartSect";
        newOption.content.querySelector('.part').class = "newPartSect";               
        newOption.content.querySelector('.part').innerHTML = partName;
        newOption.content.querySelector('.part').value = j;                 
        document.getElementById("newPartSect[" + treatment_serial + "]").appendChild(newOption.content.cloneNode(true));   
                                                 
    } 
    //治療類別和方式                        
    for(var b=0; b<options.data.treatment.length; b++){
        var partType = options.data.treatment[b].typeName;
        var partTypeID = options.data.treatment[b].typeID;
        newTherapyItem.content.querySelector('.therapySectContent').id = treatment_serial + "_" + b + "newTherapy" + partTypeID;                    
        newTherapyItem.content.querySelector('.therapy_group').id = partTypeID;     
        newTherapyItem.content.querySelector('.therapy_name').innerHTML = partType;
        
        document.getElementById("newTherapySect[" + treatment_serial + "]").appendChild(newTherapyItem.content.cloneNode(true));                           
        for(var c=0;c<options.data.treatment[b].content.length;c++){
            var treatmentName = options.data.treatment[b].content[c].name;
            var treatmentID = options.data.treatment[b].content[c].ID;
            newTreatmentItem.content.querySelector('.treatmentset').id = treatment_serial + "_" + b + "_" + c+ "newTreatmentCheck"; 
            //newTreatmentItem.content.querySelector('.treatmentset').value = c;
            newTreatmentItem.content.querySelector('.treatmentset').value = partTypeID +","+ treatmentID;//治療類型ID+治療ID
            newTreatmentItem.content.querySelector('.treatmentset').class = treatment_serial + "newTreatmentCheck" + treatmentID;                   
            newTreatmentItem.content.querySelector('.treatmentset').setAttribute("name", treatmentName);                                
            newTreatmentItem.content.querySelector('.treatmentwordset').id = treatment_serial + "newTreatment" + treatmentID;       
            newTreatmentItem.content.querySelector('.treatmentwordset').class = treatment_serial + "newTreatment" + treatmentID;                                                 
            newTreatmentItem.content.querySelector('.treatmentwordset').innerHTML = treatmentName;
            document.getElementById(treatment_serial + "_" + b + "newTherapy" + partTypeID).appendChild(newTreatmentItem.content.cloneNode(true));
        }                                   
        
    }    
}

/* Edit patient info */
function editPatientInfo() {
    if($("#editPatientHistoryOKButtonLink").is(":visible") === true) {
        alert("請先完成編輯病歷與商品販賣紀錄");
    } else {
        var tempName = $("#patientBoxTitleName").val();
        var tempSex = $("#patientBoxTitleSex").val();
        var tempBirth = $("#patientBoxTitleBirth").val();
        var tempBirthSplit = tempBirth.split('-');
        var tempBirthYear = tempBirthSplit[0];
        var tempBirthMonth = tempBirthSplit[1];
        var tempBirthDay = tempBirthSplit[2];
        var tempPhone1 = $("#patientBoxTitlePhone1").val();
        var tempPhone2 = $("#patientBoxTitlePhone2").val();
        var tempAddress =  $("#patientBoxTitleAddress").val();
        var tempNote = $("#patientBoxTitleNote").val();
        /* Replace spans with input */
        $("#editPatientBoxTitleName").val(tempName);
        $("#editPatientBoxTitlePhone1").val(tempPhone1);
        $("#editPatientBoxTitlePhone2").val(tempPhone2);
        $("#editPatientBoxTitleAddress").val(tempAddress);
        $("#editPatientBoxTitleNote").val(tempNote);
        if (tempSex == "男") {
            $("#patientBoxTitleSex0").attr("selected", null);
            $("#patientBoxTitleSex1").attr("selected", "selected");
        } else {
            $("#patientBoxTitleSex1").attr("selected", null);
            $("#patientBoxTitleSex0").attr("selected", "selected");
        }
        
        calcDate(tempBirthYear, tempBirthMonth, tempBirthDay);

        togglePatientInfoEditMode("on");
    }
}

function editPatientInfoDate() {
    var yearSelected = $("#editPatientBoxTitleBirthYear").val();
    var monthSelected = $("#editPatientBoxTitleBirthMonth").val();
    var daySelected = $("#editPatientBoxTitleBirthDay").val();

    calcDate(yearSelected, monthSelected, daySelected);
}

/* Handle date input rules */
function calcDate(yearIn, monthIn, dayIn) {
    var todayDate = new Date(),
        monthLimit = 0,
        dayLimit = 0;
    
    // Reset calendar
    $("#editPatientBoxTitleBirthYear").html("");
    $("#editPatientBoxTitleBirthMonth").html("");
    $("#editPatientBoxTitleBirthDay").html("");
    
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
        
        $("#editPatientBoxTitleBirthYear").append(yearOption);
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
        
        $("#editPatientBoxTitleBirthMonth").append(monthOption);
    }
    
    // DAY
    for (var k=1; k<=dayLimit; k++) {
        var dayOption = $("<option></option>").text(("0"+k).slice(-2)).val(("0"+k).slice(-2));
        
        if (k == dayIn) {
            dayOption.attr("selected","selected");
        }
        
        $("#editPatientBoxTitleBirthDay").append(dayOption);
    }
}

/* Update patient info */
function updatePatientInfo() {
    var r = confirm("確定要編輯此筆資料?");
    if (r == true) {    
        /* Old data */
        var tempName = $("#patientBoxTitleName").val();
        var tempSex = $("#patientBoxTitleSex").val();
        var tempBirth = $("#patientBoxTitleBirth").val();
        var tempBirthSplit = tempBirth.split('-');
        var tempBirthYear = tempBirthSplit[0];
        var tempBirthMonth = tempBirthSplit[1];
        var tempBirthDay = tempBirthSplit[2];
        var tempPhone1 = $("#patientBoxTitlePhone1").val();
        var tempPhone2 = $("#patientBoxTitlePhone2").val();
        var tempAddress = $("#patientBoxTitleAddress").val();
        var tempNote = $("#patientBoxTitleNote").val();
        /* New data */
        var tempEditName = $("#editPatientBoxTitleName").val();
        var tempEditSex = $("#editPatientBoxTitleSex").val();
        var tempEditBirthYear = $("#editPatientBoxTitleBirthYear").val();
        var tempEditBirthMonth = $("#editPatientBoxTitleBirthMonth").val();
        var tempEditBirthDay = $("#editPatientBoxTitleBirthDay").val();
        var tempEditBirth = tempEditBirthYear+"-"+tempEditBirthMonth+"-"+tempEditBirthDay; //SHOULD BE FORMATTED
        var tempEditPhone1 = $("#editPatientBoxTitlePhone1").val();
        var tempEditPhone2 = $("#editPatientBoxTitlePhone2").val();
        var tempEditAddress = $("#editPatientBoxTitleAddress").val();
        var tempEditNote = $("#editPatientBoxTitleNote").val();
        /* Update data function */
        $.post({
            url: "api/updatePatient.php", // URL of API
            data: JSON.stringify({
                // User
                // account:"admin",
                token: token,
                // Request
                department_patientID: dataOutCaseID,
                data: {
                    oldpatientsData: {
                      name: tempName,
                      birthday: tempBirth,
                      gender: tempSex,
                      phone1: tempPhone1,
                      phone2: tempPhone2,
                      address: tempAddress,
                      note: tempNote
                    },
                    newpatientsData: {
                      name: tempEditName,
                      birthday: tempEditBirth,
                      gender: tempEditSex,
                      phone1: tempEditPhone1,
                      phone2: tempEditPhone2,
                      address: tempEditAddress,
                      note: tempEditNote
                    }
                }
            }),
            success: function (jsonData) { // Callback function when successful
                viewMessage(jsonData); // Call VIEW function 
            },
            error: function () {
                alert("ERROR: Database connection failed.");
            },
            contentType: "application/json;charset=UTF-8",
        });
        
        /* If update success, replace old data; If failed, show alert */
        $("#patientBoxTitleName").html(tempEditName);
        $("#patientBoxTitleName").val(tempEditName);
        $("#patientBoxTitleSex").html(tempEditSex+" /");
        $("#patientBoxTitleSex").val(tempEditSex);
        $("#patientBoxTitleBirth").html(tempEditBirth+"生");
        $("#patientBoxTitleBirth").val(tempEditBirth);
        $("#patientBoxTitlePhone1").html(tempEditPhone1);
        
        if(tempEditPhone1 == "") {
            $("#patientBoxTitlePhone1").html("");
            $("#patientBoxTitlePhone1").val("");
        } else {
            $("#patientBoxTitlePhone1").html(tempEditPhone1);
            $("#patientBoxTitlePhone1").val(tempEditPhone1);
        }
        
        if(tempEditPhone2 == "") {
            $("#patientBoxTitlePhone2").html("");
            $("#patientBoxTitlePhone2").val("");
        } else {
            $("#patientBoxTitlePhone2").html("/ "+tempEditPhone2);
            $("#patientBoxTitlePhone2").val(tempEditPhone2);
        }

        if(tempEditAddress == "") {
            $("#patientBoxTitleAddress").html("");
            $("#patientBoxTitleAddress").val("");
        } else {
            $("#patientBoxTitleAddress").html("/ "+tempEditAddress);
            $("#patientBoxTitleAddress").val(tempEditAddress);
        }
        if(tempEditNote == "") {
            $("#patientBoxTitleNote").html("");
            $("#patientBoxTitleNote").val("");
        } else {
            $("#patientBoxTitleNote").html("/ "+tempEditNote);
            $("#patientBoxTitleNote").val(tempEditNote);
        }
        togglePatientInfoEditMode("off");
    }
}
function togglePatientInfoEditMode(modeSwitch) {
    if(modeSwitch == "off" || modeSwitch == "OFF" || modeSwitch == "Off") {
        /* Hide edit inputs */
        $("#editPatientBoxTitleName").hide();
        $("#editPatientBoxTitleSex").hide();
        $("#editPatientBoxTitleBirthYear").hide();
        $("#editPatientBoxTitleBirthMonth").hide();
        $("#editPatientBoxTitleBirthDay").hide();
        $("#editPatientBoxTitleBirthLabel").hide();
        $("#editPatientBoxTitlePhone1").hide();
        $("#editPatientBoxTitlePhone2").hide();
        $("#editPatientBoxTitleAddress").hide();  
        $("#editPatientBoxTitleNote").hide();    
        $("#editPatientInfoOKButtonLink").hide();
        
        /* Show spans */
        $("#patientBoxTitleName").show();
        $("#patientBoxTitleSex").show();
        $("#patientBoxTitleBirth").show();
        $("#patientBoxTitlePhone1").show();
        $("#patientBoxTitlePhone2").show();
        $("#patientBoxTitleAddress").show();  
        $("#patientBoxTitleNote").show();      
        $("#editPatientInfoButtonLink").show();

    }
    
    if(modeSwitch == "on" || modeSwitch == "ON" || modeSwitch == "On") {
        /* Hide old spans*/
        $("#patientBoxTitleName").hide();
        $("#patientBoxTitleSex").hide();
        $("#patientBoxTitleBirth").hide();
        $("#patientBoxTitlePhone1").hide();
        $("#patientBoxTitlePhone2").hide();
        $("#patientBoxTitleAddress").hide();
        $("#patientBoxTitleNote").hide();
        /* Show inputs */
        $("#editPatientBoxTitleName").show();
        $("#editPatientBoxTitleSex").show();
        $("#editPatientBoxTitleBirthYear").show();
        $("#editPatientBoxTitleBirthMonth").show();
        $("#editPatientBoxTitleBirthDay").show();
        $("#editPatientBoxTitleBirthLabel").show();
        $("#editPatientBoxTitlePhone1").show();
        $("#editPatientBoxTitlePhone2").show();
        $("#editPatientBoxTitleAddress").show();
        $("#editPatientBoxTitleNote").show();
        // REPLACE EDIT BUTTON WITH OK AND CANCEL BUTTONS
        $("#editPatientInfoButtonLink").hide();
        $("#editPatientInfoOKButtonLink").show();
    }
}

/* Edit treatment and good records */
function editRecord() {
    // Check if patient info is editing
    if($("#editPatientInfoOKButtonLink").is(":visible") === true) {
        alert("請先完成編輯基本資料"); // Show alert if patient info is editing
    } else if($("#patientBoxExamPrice").html() || $("patientBoxGoodPrice").html()) {
        toggleRecordEditMode("on");
        $("#patientBoxDateSect").prop('disabled', 'disabled');        
    }
}
/* Delete treatment and good records */
function deleteRecord() {
    // Check if patient info is editing
    if($("#editPatientInfoOKButtonLink").is(":visible") === true) {
        alert("請先完成編輯基本資料"); // Show alert if patient info is editing
    } else {
        $("#patientBoxDateSect").prop('disabled', 'disabled');        
        var r = confirm("確定要刪除此筆資料?");
        if (r == true) { 
            /* Delete Record */
            $.post({
                url: "api/deleteCaseHistory.php", // URL of API
                data: JSON.stringify({
                    token: token,
                    caseID: dateOptionSelectedCaseHistoryID
                }),
                success: function (jsonData) { // Callback function when successful
                    // HIDE EDIT COLUMNS AND SHOW SPANS
                    viewDeleteMessage(jsonData);
                },
                fail: function () {
                    alert("ERROR: Database connection failed.");
                },
                contentType: "application/json;charset=UTF-8",
            });            
        }
    }
}
function viewDeleteMessage(dataIn) {
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
function viewMessage(dataIn) {
    deleteData = dataIn;
    if(deleteData.code==0){
        alert(deleteData.msg);
    }else if(deleteData.code==2){
        alert(deleteData.msg);
        reLogin();        
    }else{   
        alert("編輯成功");
        location.reload();
    }
}
function askOptions(patientIDIn, departmentIDIn) {
    //var returnData;
    patientIDIn = patientIDIn;
    departmentIDIn = departmentIDIn;
    var dbData = $.post({
        url: "api/getInsertCaseData.php", // URL of API
        data: JSON.stringify({
            // User
            // account:"admin",
            token: token,
            
            // Request
            department_patientID: patientIDIn, // patientIDIn
            departmentID: departmentIDIn // departmentIDIn
        }),
        success: function (jsonData) { // Callback function when successful
            if(jsonData.code==2){
                alert(jsonData.msg);
                reLogin();
            }else{
                return jsonData;
            }
        },
        error: function () {
            alert("ERROR: Database connection failed.");
        },
        contentType: "application/json; charset=UTF-8",
        async: false
    }).responseText;

    return dbData;
}

/* Update treatment and good records */
function updateRecord() {
    $("#patientBoxDateSect").prop('disabled', false);    
    var r = confirm("確定要編輯此筆資料?");
    if (r == true) { 

        //請選擇部位 
        var goal_part = true;
        $('.partlist').each(function(){
            if($(this).val() == -1){
                alert("請選擇部位");
                goal_part = false;
                return false;
            } 
        });
        if (!goal_part){
            return;
        }
        
        //請選擇症狀
        var goal_disease = true;
        $('.diseaselist').each(function(){
            if($(this).val() == -1){
                alert("請選擇症狀");
                goal_disease = false;
                return false;
            } 
        });
        if (!goal_disease){
            return;
        }

        //請選擇治療方式
        var goal_treatment = true;
        $('.exact_money').each(function(){
            if($(this).val() == 0){
                alert("請選擇治療方式");
                goal_treatment = false;
                return false;
            } 
        });
        if (!goal_treatment){
            return;
        }

        //請選擇商品
        var goal_merchandiseName = true;
        $('.merchandiseName').each(function(){
            if($(this).val() == -1){
                alert("請選擇商品");
                goal_merchandiseName = false;
                return false;
            } 
        });
        if (!goal_merchandiseName){
            return;
        }

        //請選擇商品尺寸
        var goal_merchandiseSize = true;
        $('.merchandiseSize').each(function(){
            if($(this).val() == -1){
                alert("請選擇商品尺寸");
                goal_merchandiseSize = false;
                return false;
            } 
        });
        if (!goal_merchandiseSize){
            return;
        }

        /*跑所有新增的項目*/
        getTreatmentAsJSON();
        getMerchandiseAsJSON();

        /* Update Record */
         $.post({
             url: "api/updateCaseHistory.php", // URL of API
             data: JSON.stringify({
                 // User
                 // account:"admin",
                 token: token,

                 // Request
                 //department_patientID:dataOutCaseID,
                 date: dateOptionSelectedDate,
                 caseHistory_ID: dateOptionSelectedCaseHistoryID,  
                 departmentID:detailButtonClickedDepartmentID,

                 // Data
                 oldCaseTreatment: oldTreatmentRecords,
                 newCaseTreatment: newTreatmentRecords,
                 oldCaseMerchandise: oldGoodRecords,
                 newCaseMerchandise: newGoodRecords

             }),
             success: function (jsonData) { // Callback function when successful
                 // HIDE EDIT COLUMNS AND SHOW SPANS
                 viewMessage(jsonData);
             },
             fail: function () {
                 alert("ERROR: Database connection failed.");
             },
             contentType: "application/json;charset=UTF-8",
         });
        
        toggleRecordEditMode("off");
    }
}

function toggleRecordEditMode(modeSwitch) {
    if (modeSwitch == "on") {
        /* Hide old spans */
        $("#editPatientHistoryButtonLink").hide();
        $("#deletePatientHistoryButtonLink").hide();
        $(".examItemTitleBody").hide();
        $(".examItemTitleDisease").hide();
        $(".examItemTreatment").hide();
        $(".examItemPrice").hide();
        $(".goodItemName").hide();        
        $(".goodItemSize").hide();
        $(".goodItemQuantityInput").hide();
        $(".goodItemPriceInput").hide();
        $(".examItemPriceLabel").hide();
        $("#patientBoxTotalPrice").hide();

        /* Show inputs and lists */
        $("#add_treatment").show();
        $("#add_merchandise").show();
        $("#editPatientHistoryOKButtonLink").show();
        $(".editExamItemTitleBody").show();
        $(".editExamItemTitleDisease").show();
        $(".editExamItemTreatment").show();
        $(".editExamItemPrice").show();
        $(".goodItemQuantityBlock").css('border', 'none');
        $(".editGoodItemName").show();
        $(".editGoodItemSize").show();
        $(".goodItemMinusButton").show();
        $(".editGoodItemQuantityInput").show();
        $(".goodItemPlusButton").show();
        $(".editGoodItemPriceInput").show();
        $(".delete").show();
        $(".merchandiseCash").show();
        $("#patientBoxFlexiblePrice").show();     
        // $("#patientTableBlock").show();            
    }
    
    if (modeSwitch == "off") {
        /* Hide edit inputs */
        $("#editPatientHistoryOKButtonLink").hide();
        $(".editExamItemTitleBody").hide();
        $(".editExamItemTitleDisease").hide();
        $(".editExamItemTreatment").hide();
        $(".editExamItemPrice").hide();
        $(".editGoodItemName").hide();
        $(".editGoodItemSize").hide();
        $(".goodItemMinusButton").hide();
        $(".editGoodItemQuantityInput").hide();
        $(".goodItemPlusButton").hide();
        $(".editGoodItemPriceInput").hide();
        $("#add_treatment").hide();
        $("#add_merchandise").hide();
        $(".delete").hide();
        $(".merchandiseCash").hide();
        $("#patientBoxFlexiblePrice").hide();    
        // $("#patientTableBlock").hide();
        /* Show spans and divs */
        //$("#editPatientHistoryButtonLink").show();
        $("#deletePatientHistoryButtonLink").show();
        $(".examItemTitleBody").show();
        $(".examItemTitleDisease").show();
        $(".examItemTreatment").show();
        $(".examItemPrice").show();
        $(".goodItemName").show();
        $(".goodItemSize").show();
        $(".goodItemQuantityInput").show();
        $(".goodItemPriceInput").show();
        $(".examItemPriceLabel").show();
        $("#patientBoxTotalPrice").show();        
    }
}

/* Reset layout */
function resetPatient() {
    /* Reset patientBoxTitleBlock */
    $("#patientBoxTitleCaseID").html("");
    $("#patientBoxTitleName").html("");
    $("#patientBoxTitleAge").html("");
    $("#patientBoxTitleID").html("");
    $("#patientBoxTitleSex").html("");
    $("#patientBoxTitleBirth").html("");
    $("#patientBoxTitleFirst").html("");
    $("#patientBoxTitlePhone1").html("");
    $("#patientBoxTitlePhone2").html("");
    $("#patientBoxTitleAddress").html("");
    $("#patientBoxTitleNote").html("");
    /* Reset input values in edit mode */
    $("#editPatientBoxTitleName").val("");
    $("#editPatientBoxTitlePhone1").val("");
    $("#editPatientBoxTitlePhone2").val("");
    $("#editPatientBoxTitleAddress").val("");    
    $("#editPatientBoxTitleNote").val("");  
    /* Reset patientBoxDateSect */
    var oldView = document.getElementById('patientBoxDateSect');
    while (oldView.lastChild) {
        oldView.removeChild(oldView.lastChild);
    }
    
    var defaultDateOption = document.getElementById('defaultDateOption');
    document.getElementById('patientBoxDateSect').appendChild(defaultDateOption.content.cloneNode(true));
}

function resetExamGoodPrice() {
    /* Reset global vars */
    treatment_serial=-1;
    merchandise_serial=-1;    
    oldTreatmentRecords = [];
    newTreatmentRecords = [];
    oldGoodRecords = [];
    newGoodRecords = [];    
    /* Reset patientBoxExamSect */
    var oldView1 = document.getElementById('patientBoxExamSect');
    while (oldView1.firstChild) {
        oldView1.removeChild(oldView1.firstChild);
    }

    /* Reset patientBoxGoodSect */
    var oldView2 = document.getElementById('patientBoxGoodSect');
    while (oldView2.firstChild) {
        oldView2.removeChild(oldView2.firstChild);
    }

    /* Reset Table */
    $("#patientTable").html("");

    /* Reset price display area */
    $("#patientBoxExamPrice").html("");
    $("#patientBoxGoodPrice").html("");
    $("#patientBoxTotalPrice").html("");
    $("#patientBoxDateSect").removeAttr('disabled');
}

function keyBoardControl(key) {
    //if (e.keyCode === 13) $('.save').click();     // enter
    if (key.keyCode === 27) $("#lightBoxCloseButton").click();   // esc
}

// Update 實收金額(因為朋友來了 所以打折)
function updateTotalNumber() {
    var money = 0;
    var total = 0;
    $('.money').each(function(){
        var this_money = $(this).val()? $(this).val():0;
        money = money + parseInt(this_money);
    });
    $('.total').each(function(){
        var this_total = parseInt( $(this).val(), 0);
        total = total + parseInt(this_total);
    });
    $(".total_number").val(parseInt(money)+parseInt(total));
}

//Update 應收金額
function updateShouldNumber() {
    var exact_money = 0;
    var exact_cash = 0;
    $('.exact_money').each(function(){
        var this_exact_money = $(this).val()? $(this).val():0;
        exact_money = exact_money + parseInt(this_exact_money);
    });
    $('.exact_cash').each(function(){
        var exact_cash_quantity = parseInt($(this).parent().find('.quantity').val());
        var unitPrice = parseInt( $(this).val(), 0);
        var result = exact_cash_quantity*unitPrice;
        exact_cash = exact_cash + result;
    });
    $(".should_number").val(parseInt(exact_money)+parseInt(exact_cash));
}

//Delete newTretmentRecords
function newTreatmentRecords_delete(deleteTreatmentID){
    if (deleteTreatmentID<=treatment_flag){
        for (var h = 0; h < newTreatmentRecords[deleteTreatmentID].treatment.length;h++){
            newTreatmentRecords[deleteTreatmentID].treatment[h].isDelete = 1;
        } 
    }else{
        delete_treatment_flag.push(deleteTreatmentID);
        // var treatmentObject2 = {};
        // treatmentObject2["diseaseID"] = 0;
        // treatmentObject2["packetageID"] = 0;
        // treatmentObject2["price"] = 0;
        // treatmentObject2["charge"] = 0;
        
        // var treatmentSelected = [];
        // var single = {};
        // single["ID"] = 0;
        // single["treatmentID"] = 0;
        // single["isDelete"] = 1;
        // treatmentSelected.push(single);
        // treatmentObject["treatment"] = treatmentSelected;
        // newTreatmentRecords[deleteTreatmentID]=treatmentObject2;   
    }
}

//Delete newMerchandiseRecords
function newMerchandiseRecords_delete(deleteGoodID){
    if (deleteGoodID<=merchandise_flag){
        newGoodRecords[deleteGoodID].isDelete = 1;
    }else{
        delete_merchandise_flag.push(deleteGoodID);
        // var merchandiseObject2 = {};
        // merchandiseObject2["ID"] = 0;
        // merchandiseObject2["merchandiseID"] = 0;
        // merchandiseObject2["amount"] = 0;
        // merchandiseObject2["price"] = 0;
        // merchandiseObject2["charge"] = 0;
        // merchandiseObject2["delete"] = 1;
        // newGoodRecords[deleteGoodID]=merchandiseObject2; 
    }
}
//JSON轉換函數：診療內容轉換為JSON字串
function getTreatmentAsJSON(){
    for(var i = treatment_flag+1; i <= treatment_serial; i++){
        var content = document.getElementById('newFormSect['+i+']');  
        if(delete_treatment_flag.includes(i) == false){
            var treatmentObject = {};
            //疾病
            treatmentObject["diseaseID"] = $(content).find('.diseaselist option:selected').val();
            treatmentObject["price"] = $(content).find('.exact_money').val();
            treatmentObject["charge"] = $(content).find('.money').val();
            //治療方式
            var treatments = content.querySelectorAll("input:checked");
            var treatmentSelected = [];
            for(var j = 0; j< treatments.length; j++){
                var id = treatments[j].value.split(',');
                var single = {};
                single["ID"] = "0";
                treatmentObject["packetageID"] = id[0];
                single["treatmentID"] = id[1];
                single["isDelete"] = 0;
                treatmentSelected.push(single);
            }
            treatmentObject["treatment"] = treatmentSelected;
            newTreatmentRecords.push(treatmentObject);
        }
    }
}
//JSON轉換函數：商品內容轉換為JSON字串
function getMerchandiseAsJSON(){
    for(var i = merchandise_flag+1; i <= merchandise_serial; i++){
        var content = document.getElementById(i+'newmerchContent');
        if(delete_merchandise_flag.includes(i) == false){
            var merchandiseObject = {};
            merchandiseObject["ID"] = 0;
            merchandiseObject["merchandiseID"] = $(content).find('.merchandiseSize option:selected').val();
            merchandiseObject["amount"] = $(content).find('.quantity').val();
            if($(content).find('.quantity').val() == 0 ){
                alert("商品數量不得為零");
                return;
            }
            merchandiseObject["price"] = $(content).find('.exact_cash').val();
            merchandiseObject["charge"] = $(content).find('.total').val();
            merchandiseObject["isDelete"] = 0;
            newGoodRecords.push(merchandiseObject);   
        }
    }
}