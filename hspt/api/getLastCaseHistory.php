<?php
	/*
		API=1.0 在新增病歷時，取得上次病歷
		2016-10-02 v1 By陳志鴻 完成第一版
		2016-10-12 TE By陳志鴻 DB修正，API測試不過(TE=TestError)
		2016-10-12 v2 By陳志鴻 針對DB的欄位修正，修正SQL語法
		2016-12-24 v3 By陳志鴻 1.修正「該帳號無法查詢病歷」的判斷式。2.對應DB欄位名稱修正
		2017-06-18 v4 配合資料庫修正，並優化程式寫法
		2017-07-02 v5 新增共用函式庫
		2017-08-12 v6 修改回傳的資料格式(最終版)
	*/

	/* 初始化：取得共用函式庫、取得輸入資料、資料庫連線 */
    include('shareFunction.php');
    $data = getJsonInput();  
    $link = initDB();
	
    /* 執行功能 */
    $token = $data -> token;
    $departmentID = $data -> departmentID;//傳入資料:分部名稱
	$therapistAccount = $data -> therapistAccount;//傳入資料:治療師account
	$department_patientID = $data -> department_patientID;//傳入資料:分部病歷號

    $codeAdmin = "01-2-取得跨區治療師";
    $userAdmin = getAccount($link,$token,$codeAdmin);
    $codeLocal = "01-2-取得單位治療師";
    $userLocal = getAccount($link,$token,$codeLocal);
    $codeNormal = "00-0-預設權限";
    $userNormal = getAccount($link,$token,$codeNormal);


	if($userAdmin == null && $userNormal["Department_ID"] != $departmentID){
		die(printJson(0, "無 $codeAdmin 權限", ""));
	}
	if($userLocal == null && $therapistAccount != $userNormal["account"]){
		die(printJson(0, "無 $codeLocal 權限", ""));
	}

    $patient = getPatient($link,$department_patientID);
    $patientsData = getPatientData($patient);
	if($patientsData == null){
		die(printJson(0, "查無該病患資料", ""));
	}

	$caseHistory_ID = getLastCaseID($link,$therapistAccount,$department_patientID);
	if($caseHistory_ID == 0){
		die(printJson(0, "查無上一次病歷(首次就醫)", ""));
	}

	$caseTreatment = getCaseTreatmentData(getCaseTreatment($link,$caseHistory_ID));
	$caseMerchandise = getCaseMerchandiseData(getCaseMerchandise($link,$caseHistory_ID));
	$data = array(
		'patientsData' => $patientsData,
		'lastCaseTreatment' => $caseTreatment,
		'lastCaseMerchandise' => $caseMerchandise
	);
	if($caseTreatment != null || $caseMerchandise != null){
		printJson(1, "", $data);
	}
	else{
		printJson(0, "查無上一次病歷(首次選擇該治療師)", $data);
	}

/* 取得該病患與該治療師組合的最後一次紀錄 */
function getLastCaseID($link,$therapistAccount,$department_patientID){
	$dataq="SELECT * FROM CaseHistory WHERE CaseDepartment_ID=".$department_patientID." AND User_account2='".$therapistAccount."' ORDER BY time desc LIMIT 1 ";
	$result=mysqli_query($link,$dataq);
	if($result){
		while($row=mysqli_fetch_assoc($result)){
			return $row["ID"];
		}
	}
	return 0;
}
/* 產生診療輸出資料 */
function getCaseTreatmentData($caseTreatment){
	if($caseTreatment == NULL) return;
	$result = array();//要回傳的資料

	foreach ($caseTreatment as $single) {
		// 治療方式
		$treatmentIds = explode(",",$single["treatmentID"]);
		$treatments = array();
        foreach ($treatmentIds as $id) {
        	$singleTreatment = array(
				'ID' => $id,
			);
        	array_push($treatments, $singleTreatment);
        }
        // 輸出資料
		$output = array(
			'ID' => $single["ID"],
			'diseaseID' => $single["diseaseID"],
			'treatmentTypeID' => $single["treatmentTypeID"],
			'treatments' => $treatments
		);
		array_push($result, $output);
	}
	return $result;
}
/* 產生診療商品輸出資料 */
function getCaseMerchandiseData($caseMerchandise){
	if($caseMerchandise == NULL) return;

	$merchandise = array();
	foreach ($caseMerchandise as $single) {
		$single = array(
			'ID' => $single["ID"],
            'merchandiseID' => $single["merchandiseID"]
		);
		array_push($merchandise, $single);
	}
	return $merchandise;
}

?> 