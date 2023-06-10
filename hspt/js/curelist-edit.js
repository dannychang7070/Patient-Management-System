//Global Variables
var lastCaseData;
var insertCaseData;
var merchandise_serial=-1;
var treatment_serial=-1;
var token;

$(document).ready(function () {
	token = getCookie("token");
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

   		var remaining_number = insertCaseData.data.merchandise[merchandiseName_index].content[merchandiseSize_index].remaining;
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

   		var remaining_number = insertCaseData.data.merchandise[merchandiseName_index].content[merchandiseSize_index].remaining;
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

	//按下確定送出病歷資料
	$(document).on('click', 'button.sned', function(){
		var confirmation = confirm("確定新增?");
	    if (confirmation == true) {
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

			var caseDataAsJson = {};
			//病歷基本資料
			caseDataAsJson["token"] = token;
			caseDataAsJson["departmentID"] = getUrlVars()['page_department'];
			caseDataAsJson["therapistAccount"] = $(document.getElementById('therapistlist')).find('option:selected').val();
			caseDataAsJson["department_patientID"] = getUrlVars()['case_id'];
			caseDataAsJson["dateString"] = document.getElementById("selectYear").value+"-"+document.getElementById("selectMonth").value+"-"+document.getElementById("selectDay").value+"T"+document.getElementById("selectHour").value+":"+document.getElementById("selectMinute").value+":00";
			caseDataAsJson["note"] = document.getElementById("exampleFormControlTextarea1").value;
			//診療內容轉成json
			caseDataAsJson["caseTreatment"] = getTreatmentAsJSON();
			//商品內容轉成json
			caseDataAsJson["caseMerchandise"] = getMerchandiseAsJSON();
			//呼叫api
			if (caseDataAsJson["caseTreatment"].length === 0 && caseDataAsJson["caseMerchandise"].length === 0){
				alert("無新增病例資料，請輸入診療內容或商品");
			}else{
				sendDataToAPI(JSON.stringify(caseDataAsJson));
			}
	    } else {

	    }		
	});
	//按下取消回到首頁
	$(document).on('click', 'button.cancel', function(){
		var r = confirm("確定捨棄?");
	    if (r == true) {
			window.location.href = "index.html"; 
	    } else {

	    }		
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
    	$(this).parent().find("input.package").val("");    	          
        $(this).parent().find('.diseaselist option[value!="-1"]').remove();
        if(partIndex==-1){
       		updateShouldNumber();
			updateTotalNumber();         	
        	return;
        }
        for(k=0;k<insertCaseData.data.disease[partIndex].content.length;k++){
            var contentName = insertCaseData.data.disease[partIndex].content[k].name;
            var contentID = insertCaseData.data.disease[partIndex].content[k].ID;
            newDiseaseItem.content.querySelector('.disease').id = $(this).parent().find('.partlist').find("option:selected").prop('id') + "_" +k + "newDiseaseSect"; 
            newDiseaseItem.content.querySelector('.disease').innerHTML = contentName;
            newDiseaseItem.content.querySelector('.disease').value = contentID;
      		newDiseaseItem.content.querySelector('.disease').class = "newDiseaseSect";	            
            $(this).parent().find('.diseaselist').append(newDiseaseItem.content.cloneNode(true));
        }
    });	 	

    //當部位+症狀選好後，邏輯:解除治療checkbox封印 但不是每個類型都可以選/ 要判斷有沒有部位+症狀+治療是相同的/ check後跳價錢
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
    	$(this).parent().find("input.package").val("");       	
    	if(partValue==-1){
    		updateShouldNumber();
			updateTotalNumber();
    		return;
    	}
    	for(p=0; p<insertCaseData.data.disease[partValue].content.length;p++){
    		if(diseaseValue==insertCaseData.data.disease[partValue].content[p].ID){
    			for(r=0; r<insertCaseData.data.disease[partValue].content[p].package.length;r++){
		    		var treatmentType = insertCaseData.data.disease[partValue].content[p].package[r].treatmentType;
		    		for(q=0; q<insertCaseData.data.treatment.length;q++){
		    			if(insertCaseData.data.treatment[q].typeID==treatmentType){
							$(this).parent().find("#"+parse_suffix+"_"+q+"newTherapy"+treatmentType).find("input.treatmentset").prop("disabled", false);
						}
					}
				}
			}
    	}
    	updateShouldNumber();
		updateTotalNumber();    	
    });

    //TreamentSet做選一不再選
    $(document).on('click', 'input.treatmentset', function(){ 
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
	    		$(parent_set4).find(".moneylist").find("input.package").val("");
		        updateShouldNumber();
				updateTotalNumber(); 	    		
	    		return;       		
	    	}
	    	for(p=0; p<insertCaseData.data.disease[partValue].content.length;p++){
	    		if(diseaseValue == insertCaseData.data.disease[partValue].content[p].ID){
	    			for(r=0; r<insertCaseData.data.disease[partValue].content[p].package.length;r++){
			    		if( treatmentValue == insertCaseData.data.disease[partValue].content[p].package[r].treatmentType){
			    			var treatmentPrice = insertCaseData.data.disease[partValue].content[p].package[r].price;
			    			var packageID = insertCaseData.data.disease[partValue].content[p].package[r].ID;
			    			$(parent_set4).find(".money").val(treatmentPrice);
			    			$(parent_set4).find(".exact_money").val(treatmentPrice);
			    			$(parent_set4).find(".package").val(packageID);		    			
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
	    	$(parent_set4).find(".moneylist").find("input.package").val("");     		    		
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
		// 先將quantity做預設=1
		$(this).parent().find('.merchandiseCash').find('.quantity').val(1);				
		// 剩餘數量預設
		$(this).parent().find('.merchandiseCash').find('.inventory').text("剩餘 件");
		$(this).parent().find('.merchandiseCash').find('.inventory').hide();	
		if(merchandiseNameIndex==-1){
   			updateShouldNumber();
   			updateTotalNumber();
			return;
		} 	      		       			            
	    for(k=0;k<insertCaseData.data.merchandise[merchandiseNameIndex].content.length;k++){
	        var contentSize = insertCaseData.data.merchandise[merchandiseNameIndex].content[k].size;
	        var contentID = insertCaseData.data.merchandise[merchandiseNameIndex].content[k].ID;
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
	   			$(this).parent().find('.merchandiseCash').find('.exact_cash').val(insertCaseData.data.merchandise[first_index].content[second_index].price);
	   			$(this).parent().find('.merchandiseCash').find('.total').val(insertCaseData.data.merchandise[first_index].content[second_index].price);	       			
	   		}else{
	   			$(this).parent().find('.merchandiseCash').find('.exact_cash').val(0);
	   			$(this).parent().find('.merchandiseCash').find('.total').val(0);	       			
	   			$(this).parent().find('.merchandiseCash').find('.inventory').hide();	       			
	   		}
	   		var remaining_number = insertCaseData.data.merchandise[first_index].content[second_index].remaining;
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
	        for(k=0;k<insertCaseData.data.merchandise[merchandiseNameIndex].content.length;k++){
	            var contentSize = insertCaseData.data.merchandise[merchandiseNameIndex].content[k].size;
	            var contentID = insertCaseData.data.merchandise[merchandiseNameIndex].content[k].ID;
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

    //新增商品button
	$(document).on('click', '#add_merchandise', function(){	
		merchandise_serial++;	
		merchandise_template();	
	});

    //新增診療內容button
	$(document).on('click', '#add_treatment', function(){	
		treatment_serial++;	
		treatment_template();	
	});

	//Delete an existing task
	$(document).on('click', 'button.delete', function(){		
		var listItem = this.parentNode;
		var div = listItem.parentNode;
		//Remove the parent list item from the div			
		div.removeChild(listItem);
		updateShouldNumber();
		updateTotalNumber();		
	});

	//只要有Keyup在價錢欄位 都要更新實收金額
	$(document).on('keyup', 'input.money', function(){		
		updateTotalNumber();		
	});	
	$(document).on('keyup', 'input.total', function(){		
		updateTotalNumber();		
	});		

	//get現在時間
	var dt = new Date();

	//左上角日期
	calcDate(dt.getFullYear(), dt.getMonth()+1, dt.getDate(), dt.getHours(), dt.getMinutes());
    $("#selectYear, #selectMonth").change(editTimeDate);
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

function editTimeDate() {
    var yearSelected = $("#selectYear").val();
    var monthSelected = $("#selectMonth").val();
    var daySelected = $("#selectDay").val();

    calcDate(yearSelected, monthSelected, daySelected, 0, 0, 0);
}

// K: Declare other global vars
var page_therapist;
var page_date = askTodayDate();
var page_exams = {};
var page_goods = {};

// K: Get today's date (UTC+8)
function askTodayDate () {
	var todayDate = new Date();
	var todayDateFormatted = todayDate.getFullYear()+"-"+(("0"+(todayDate.getMonth()+1)).slice(-2))+"-"+todayDate.getDate()+" "+(todayDate.getUTCHours()+8)+":"+todayDate.getUTCMinutes();
	//alert(todayDateFormatted);
	return todayDateFormatted;
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


//JSON轉換函數：診療內容轉換為JSON字串
function getTreatmentAsJSON(){
	var data = [];
	for(var i = 0; i <= treatment_serial; i++){
		var content = document.getElementById('newFormSect['+i+']');
		if(content){
			var treatmentObject = {};
			//疾病
			treatmentObject["diseaseID"] = $(content).find('.diseaselist option:selected').val();
			treatmentObject["price"] = $(content).find('.exact_money').val();
			treatmentObject["charge"] = $(content).find('.money').val();
			treatmentObject["packetageID"] = $(content).find('.package').val();
			//治療方式
			var treatments = content.querySelectorAll("input:checked");
			var treatmentSelected = [];
			for(var j = 0; j< treatments.length; j++){
				var id = treatments[j].value.split(',');
				var single = {};
				single["ID"] = id[1];
				treatmentSelected.push(single);
			}
			treatmentObject["treatment"] = treatmentSelected;
			data.push(treatmentObject);
		}
	}
	return data;
}
//JSON轉換函數：商品內容轉換為JSON字串
function getMerchandiseAsJSON(){
	var data = [];
	for(var i = 0; i <= merchandise_serial; i++){
		var content = document.getElementById(i+'newmerchContent');
		if(content){
			var merchandiseObject = {};
			merchandiseObject["merchandiseID"] = $(content).find('.merchandiseSize option:selected').val();
			merchandiseObject["amount"] = $(content).find('.quantity').val();
			if($(content).find('.quantity').val() == 0 ){
				alert("商品數量不得為零");
				return;
			}
			merchandiseObject["price"] = $(content).find('.exact_cash').val();
			merchandiseObject["charge"] = $(content).find('.total').val();
			data.push(merchandiseObject);
		}
	}
	return data;
}

//API呼叫函數：新增病歷資料
function sendDataToAPI(jsonData){
	$.post({
        url: "api/insertCaseHistory.php",
        data: jsonData,
        success: function (jsonData) {
        	if(jsonData.code == 0){
        		alert("新增失敗，原因："+jsonData.msg);
        	}
            else{
            	if (confirm("新增成功") == true) {
    				window.location.href = "index.html"; 
				}else{
					window.location.href = "index.html";
				}
            } 
        },
        fail: function () {
            alert("連線失敗");
        },
        contentType: "application/json;charset=UTF-8",
    });
}
// 取得伺服器回傳的資料
function viewDBData(dataIn) {
	var insertCaseData = dataIn;
	var newTherapistItem = document.getElementById('therapistItemTemplate'); // Access therapistItem template
	if(insertCaseData.code==2){
		alert(insertCaseData.msg);
        reLogin();		
	}else{
		document.getElementById('curelist_title').innerHTML = 
		insertCaseData.data.patientsData.name+" / "+
		insertCaseData.data.patientsData.gender+" / "+
		insertCaseData.data.patientsData.birthday+"生 / "+
		insertCaseData.data.patientsData.phone1+" / "+
		insertCaseData.data.patientsData.phone2+" / "+
		insertCaseData.data.patientsData.address+" / "+
		insertCaseData.data.patientsData.note;

		for(i=0;i<insertCaseData.data.therapist.length;i++){
			var therapist_Account = insertCaseData.data.therapist[i].account;		
			var therapist_Name = insertCaseData.data.therapist[i].name;
			newTherapistItem.content.querySelector('.therapist').value = therapist_Account;
			newTherapistItem.content.querySelector('.therapist').innerHTML = therapist_Name;
			document.getElementById('therapistlist').appendChild(newTherapistItem.content.cloneNode(true));
		}
		// First step, choose one of therapists
		var count = 0;
		$('#therapistlist').change(function(){
			//選擇治療師後 獨立函數呼叫 清出原本的東西
			count++;
			if (count>0){
				$("#therapistlist option[value=0]").remove();	
				var oldView = document.getElementById('new_form');			
				while (oldView.firstChild) {
					oldView.removeChild(oldView.firstChild);
				}
				var oldView2 = document.getElementById('new_merchandise');			
				while (oldView2.firstChild) {
					oldView2.removeChild(oldView2.firstChild);
				}	
				$(".total_number").val('');
				$(".should_number").val('');
			}
			// 診療內容form		
			document.getElementById("form").style.display = "block";
			var therapist_Account= $("#therapistlist").val();
			// Second, transfer $account, $departmentID, $therapistAccount, and $department_patientID
			/* Request from the user */
			askLastCaseHistoryData(insertCaseData,therapist_Account);
			// Clean note 
			document.getElementById("exampleFormControlTextarea1").value = "";
		});
	}
}

/* API: 要跟getLastCaseHistory.php串接 */
function askLastCaseHistoryData(insertCaseData,therapist_Account) {
    $.post({
        url: "api/getLastCaseHistory.php", // URL of API
        data: JSON.stringify({
            // User
			// account: "admin",
			token: token,
			departmentID: page_department,
            // Request			
			therapistAccount: therapist_Account,
			department_patientID: page_caseid,               
        }),
        success: function (jsonData) { // Callback function when successful
            showLastCaseHistoryData(jsonData,insertCaseData); // Call VIEW function 
        },
        fail: function () {
            alert("ERROR: Database connection failed.");
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
// Third, if get last case history, prefill the form. If not, show blank form.
function showLastCaseHistoryData(dataIn, dbData) {
	lastCaseData = dataIn;
	insertCaseData = dbData;	
	if(lastCaseData.code==0){
		alert(lastCaseData.msg);
	}else if(lastCaseData.code==2){
		alert(lastCaseData.msg);
		reLogin();
	}else{
		/* Handle !data situation */
	    if (!lastCaseData.data.lastCaseTreatment) {
	        iLength = 0;
	    } else {
	        iLength = lastCaseData.data.lastCaseTreatment.length;
	    }
		/* Handle !data situation */
	    if (!lastCaseData.data.lastCaseMerchandise) {
	        jLength = 0;
	    } else {
	        jLength = lastCaseData.data.lastCaseMerchandise.length;
	    }	    
	    for(var i=0;i<iLength;i++){        
	    	treatment_serial = i;
	    	treatment_template();
	    	var diseaseID = lastCaseData.data.lastCaseTreatment[i].diseaseID;
	    	//lastCaseTreatment.treatment.treatmentID 改成lastCaseTreatment.treatments.ID 其他都不用管 by 志鴻
	    	for(var j=0;j<lastCaseData.data.lastCaseTreatment[i].treatments.length;j++){  
	    		var treatmentID = lastCaseData.data.lastCaseTreatment[i].treatments[j].ID;
	    		treatment_preselect(treatment_serial, diseaseID, treatmentID);
	    	}
	    }
	    $('.treatmentset').each(function() {
	    	var compare_id = $(this).prop('id');
	    	for(var compare_index = 0; compare_index<compare_array.length;compare_index++){
			    if (compare_id == compare_array[compare_index]) { 
				        $(this).prop('checked', true);
			    }
			}	
		});
		//這是給計算總價用的, total_number是實收,should_number是應收		
		var should_number = 0;
		//根據上次merchandise紀錄產生空的表格	
		for(var i=0;i<jLength;i++){							
			merchandise_serial = i;
			merchandise_template();
			//This function bring value and setting into Merchandise
			merchandise_preselect(merchandise_serial,lastCaseData.data.lastCaseMerchandise[i].merchandiseID);
		}	
		updateShouldNumber();
		updateTotalNumber();
	}
}

var compare_array = [];
//Preselect Treatment
function treatment_preselect(i,data1,data2){
	var j=0;
	var k=0;
	var m=0;
	var n=0;
	for(j=0;j<insertCaseData.data.disease.length;j++){
		for(k=0;k<insertCaseData.data.disease[j].content.length;k++){
			if(insertCaseData.data.disease[j].content[k].ID==data1){
				$('option#'+i+'_'+j+'newPartSect').prop('selected', true);
				//需要指定ID取得要change的元件，否則會導致畫面上class=partlist的元件全部都被呼叫到
			    $partlist = document.getElementById('newPartSect['+i+']');
			    $($partlist).change();
				$('option#'+i+'_'+j+'newPartSect_'+k+'newDiseaseSect').prop('selected', true);
			    $diseaselist = document.getElementById('newDiseaseSect['+i+']');
			    $($diseaselist).change();						
				for(m=0;m<insertCaseData.data.disease[j].content[k].package.length;m++){
					var treatmentType = insertCaseData.data.disease[j].content[k].package[m].treatmentType;
					for(n=0;n<insertCaseData.data.treatment[treatmentType-1].content.length;n++){
						if(insertCaseData.data.treatment[treatmentType-1].content[n].ID==data2){
							var treatmentTypeID = insertCaseData.data.treatment[treatmentType-1].typeID-1;
							compare_array.push(i+'_'+treatmentTypeID+'_'+n+'newTreatmentCheck');
						}
					}
				}
			}
		}
	}
}

//Preselect Merchandise
function merchandise_preselect(i,data){
	var j=0
	var k=0;
	for(j=0;j<insertCaseData.data.merchandise.length;j++){
		for(k=0;k<insertCaseData.data.merchandise[j].content.length;k++){							
			if(insertCaseData.data.merchandise[j].content[k].ID==data){
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

//Treatment Template
function treatment_template(){
	var newFormSect = document.getElementById('newFormTemplate'); // Access formSect template
	var newItem = document.getElementById('partItemTemplate'); // Access partSect template
	var newDiseaseItem = document.getElementById('diseaseItemTemplate'); // Access diseaseItem template
	var newMoneyItem = document.getElementById('moneyItemTemplate'); // Access diseaseItem template	
	var newTherapyItem = document.getElementById('therapyItemTemplate'); // Access therapyItem template	
	var newTreatmentItem = document.getElementById('treatmentItemTemplate'); // Access treatmentItem template		
	newFormSect.content.querySelector('.newformContent').id = "newFormSect[" + treatment_serial + "]";	
	newFormSect.content.querySelector('.partlist').id = "newPartSect[" + treatment_serial + "]";
	newFormSect.content.querySelector('.diseaselist').id = "newDiseaseSect[" + treatment_serial + "]";
	newFormSect.content.querySelector('.therapylist').id = "newTherapySect[" + treatment_serial + "]"; 
	newFormSect.content.querySelector('.moneylist').id = "newMoneySect[" + treatment_serial + "]";
	document.getElementById('new_form').appendChild(newFormSect.content.cloneNode(true));	 
	for(j=0;j<insertCaseData.data.disease.length;j++){
	    var partName = insertCaseData.data.disease[j].part;
	    newItem.content.querySelector('.part').id = treatment_serial + "_" + j + "newPartSect";
	    newItem.content.querySelector('.part').class = "newPartSect";	            
	    newItem.content.querySelector('.part').innerHTML = partName;
	    newItem.content.querySelector('.part').value = j;
	    document.getElementById("newPartSect[" + treatment_serial + "]").appendChild(newItem.content.cloneNode(true));                                    
	}

	//治療類別和方式  	                     
	for(b=0; b<insertCaseData.data.treatment.length; b++){
	    var partType = insertCaseData.data.treatment[b].typeName;
	    var partTypeID = insertCaseData.data.treatment[b].typeID;
	    newTherapyItem.content.querySelector('.therapySectContent').id = treatment_serial + "_" + b + "newTherapy" + partTypeID;    		        
	    newTherapyItem.content.querySelector('.therapy_group').id = partTypeID;	      
	    newTherapyItem.content.querySelector('.therapy_name').innerHTML = partType;
	    document.getElementById("newTherapySect[" + treatment_serial + "]").appendChild(newTherapyItem.content.cloneNode(true));                           
	    for(c=0;c<insertCaseData.data.treatment[b].content.length;c++){
	        var treatmentName = insertCaseData.data.treatment[b].content[c].name;
	        var treatmentID = insertCaseData.data.treatment[b].content[c].ID;
	        newTreatmentItem.content.querySelector('.treatmentset').id = treatment_serial + "_" + b + "_" + c+ "newTreatmentCheck"; 
	        newTreatmentItem.content.querySelector('.treatmentset').value = partTypeID +","+ treatmentID;//治療類型ID+治療ID
	        newTreatmentItem.content.querySelector('.treatmentset').class = treatment_serial + "newTreatmentCheck" + treatmentID; 		            
	        newTreatmentItem.content.querySelector('.treatmentset').setAttribute("name", treatmentName);                                
	        newTreatmentItem.content.querySelector('.treatmentwordset').id = treatment_serial + "newTreatment" + treatmentID;       
	        newTreatmentItem.content.querySelector('.treatmentwordset').class = treatment_serial + "newTreatment" + treatmentID;  		                                         
	        newTreatmentItem.content.querySelector('.treatmentwordset').innerHTML = treatmentName;
	        document.getElementById(treatment_serial + "_" + b + "newTherapy" + partTypeID).appendChild(newTreatmentItem.content.cloneNode(true));
	    }                                   
	}	
	//價錢
	newMoneyItem.content.querySelector('.money').id = treatment_serial + "newMoney";
	newMoneyItem.content.querySelector('.exact_money').id = treatment_serial + "newHiddenMoney";
	newMoneyItem.content.querySelector('.exact_money').type = "hidden";      
	newMoneyItem.content.querySelector('.package').id = treatment_serial + "newPackage";
	newMoneyItem.content.querySelector('.package').type = "hidden";  	                                                
	document.getElementById("newMoneySect[" + treatment_serial + "]").appendChild(newMoneyItem.content.cloneNode(true));

}

//Merchandise Template
function merchandise_template(){
	var newMerchSect = document.getElementById('newMerchandiseTemplate'); // Access MerchSect template
	var newMerchItem = document.getElementById('merchandiseNameItem'); // Access MerchItem template
	var newMerchSizeItem = document.getElementById('merchandiseSizeItem'); // Access MerchSizeItem template
	var newCashItem = document.getElementById('cashItemTemplate'); // Access cashItem template
	newMerchSect.content.querySelector('.newmerchContent').id = merchandise_serial + "newmerchContent";
	newMerchSect.content.querySelector('.merchandiseName').id = merchandise_serial + "merchandiseName";
	newMerchSect.content.querySelector('.merchandiseSize').id = merchandise_serial + "merchandiseSize";			
	newMerchSect.content.querySelector('.merchandiseCash').id = merchandise_serial + "merchandiseCash";			
	document.getElementById('new_merchandise').appendChild(newMerchSect.content.cloneNode(true));													
	for(j=0;j<insertCaseData.data.merchandise.length;j++){							
		var merchName = insertCaseData.data.merchandise[j].name;
		newMerchItem.content.querySelector('.merchandiseNameItem').id = merchandise_serial +'_'+ j + "newMerchdiseNameSect";
		newMerchItem.content.querySelector('.merchandiseNameItem').class = "newMerchdiseNameSect";				
		newMerchItem.content.querySelector('.merchandiseNameItem').innerHTML = merchName;
		newMerchItem.content.querySelector('.merchandiseNameItem').value = j;
		document.getElementById( merchandise_serial + "merchandiseName").appendChild(newMerchItem.content.cloneNode(true));				
	}
	newCashItem.content.querySelector('.quantity').id =  merchandise_serial + "newQuant";
	newCashItem.content.querySelector('.quantity').class = "newQuant";									
	newCashItem.content.querySelector('.total').id = merchandise_serial + "newTotal";
	newCashItem.content.querySelector('.total').class = "newTotal";			
	newCashItem.content.querySelector('.exact_cash').id =  merchandise_serial + "newExactCash";
	newCashItem.content.querySelector('.exact_cash').class = "newExactCash";
	document.getElementById( merchandise_serial + "merchandiseCash").appendChild(newCashItem.content.cloneNode(true));
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