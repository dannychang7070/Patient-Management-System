<?php
	/*
     * API=1.0 新增病患 insertCaseDepartment
     * 2018-03-03 v1
    */

    /* 初始化：取得共用函式庫、取得輸入資料、資料庫連線 */
    include('shareFunction.php');
    $data = getJsonInput();  
    $link = initDB();
   
	/* 執行功能 */
    $token = $data -> token;
    $departmentID = $data -> departmentID;

    $codeAdmin = "01-1-新增全區病患";
    $userAdmin = getAccount($link,$token,$codeAdmin);
    $codeNormal = "00-0-預設權限";
    $userNormal = getAccount($link,$token,$codeNormal);

    if ($userNormal == null){
		die(printJson(0, "無 $codeNormal 權限", ""));
    }
    else if ($userNormal["Department_ID"] != $departmentID && $userAdmin == null){
    	die(printJson(0, "無 $codeAdmin 權限", ""));
    }
    $account = $userNormal["account"];

    if(checkData($link,$data)){
    	$patients = getPatientsID($link,$data);
    	$result = addPatient($link,$data,$patients["patientsID"]);
    	if($result["code"] == 1){
    		$result = addCaseDepartment($link,$departmentID,$result["patientsID"],$account);
    		if($result["code"] == 1 && $patients["patientsID"] == -1){
    			$result["msg"] = "首次就診，新增病患資料成功。\n病歷號：".$result["caseNumber"];
    		}
    		else if($result["code"] == 1){
    			$result["msg"] = $patients["pastDepartment"]."，新增病患資料成功。\n病歷號：".$result["caseNumber"];
    		}
    	}
    	printJson($result["code"],$result["msg"],"");
    }
    
    
/* 判斷是否有未填欄位 */
function checkData($link,$data){
	$departmentID = $data -> departmentID;
	$keyList = ["name","birthday","gender","address"];
	if(checkEmptyByKeyListOrKey($data,"tel") && checkEmptyByKeyListOrKey($data,"phone")){
		die(printJson(0, "請輸入電話", ""));
	}
	else if(checkEmptyByKeyListOrKey($data,$keyList)){
		die(printJson(0, "有欄位未輸入", ""));
	}
	else if(is_numeric($departmentID) && $departmentID <= 0){
		die(printJson(0, "有欄位未輸入", ""));
	}
	else return true;
}

/* 取得病患ID(無資料回傳-1)、過去就診分部 */
function getPatientsID($link,$data){
	$name = $data -> name;
	$birthday = $data -> birthday;
	$pid = $data -> pid;
	$phone = $data -> phone;
	$departmentID = $data -> departmentID;
	$patientsID = -1;//病患編號
	$past = "曾在";//過去就診分部組合字串
	//取得分部轉換表
    $departmentMapping = getDepartmentMapping($link);

	//驗證病患分部是否存在
	$sql = "SELECT b.*
		FROM Patients AS a 
		JOIN CaseDepartment AS b ON a.ID = b.Patients_ID 
		WHERE (a.name = '$name' AND a.birthday = '$birthday' AND a.phone1 = '$phone') OR a.pID = '$pid'";
    $result=mysqli_query($link,$sql);

	if($result && mysqli_num_rows($result) == 0){
		return array("patientsID" => -1);//全分部首次就醫
	}
    while($row = mysqli_fetch_assoc($result)){
    	if($row["Department_ID"] == $departmentID){
    		die(printJson(0, "已存在該病患，病歷號：".$row["caseNumber"], ""));
    	}
    	$patientsID = $row["Patients_ID"];
    	$past = $past." ".$departmentMapping[$row["Department_ID"]];
    }
	return array("patientsID" => $patientsID , "pastDepartment" => $past." 就診");
}
/* 新增病患 */
function addPatient($link,$data,$patientsID){
	$name = $data -> name;
	$birthday = $data -> birthday;
	$pid = $data -> pid;
	$gender = $data -> gender;
	$phone = $data -> phone;
	$tel = $data -> tel;
	$address = $data -> address;
	$note = $data -> note;
	//無資料=>新增
	if($patientsID == -1){
		$dataq = "INSERT INTO Patients (name,birthday,pid,gender,phone1,phone2,address,note) VALUES ('".$name."','".$birthday."','".$pid."','".$gender."','".$phone."','".$tel."','".$address."','".$note."')";
    	if ($link->query($dataq) === TRUE) {
			return array("code" => 1 , "patientsID" => $link->insert_id);
    	}
    	else{
        	return array("code" => 0 , "msg" => "新增病患資料失敗");
    	}
	}
	//有資料=>更新
	$dataq = "UPDATE Patients SET phone1 = '".$phone."', phone2 = '".$tel."', address = '".$address."',note = IFNULL (CONCAT( note , '\n".$note."' ), '".$note."')"
			." WHERE ID = ".$patientsID;
	if ($link->query($dataq) === TRUE) {
		return array("code" => 1 , "patientsID" => $patientsID);
    }
    else{
        return array("code" => 0 , "msg" => "新增病患資料失敗");
    }

}
/* 新增分部病歷 */
function addCaseDepartment($link,$departmentID,$patientsID,$account){
	//取得分部末碼病歷號
	$dataq = "SELECT * FROM SCCaseNumber WHERE Department_ID = ".$departmentID;
	$result = mysqli_query($link,$dataq);
	$SC = mysqli_fetch_assoc($result);
	if($SC == NULL) die(printJson(0,"該分部病歷號初始化失敗",""));
	$caseNumber = $SC["caseNumber"] + 1;//TODO 病歷號客製處理
	
	//新增
	$dataq = "INSERT INTO CaseDepartment (caseNumber,Department_ID,Patients_ID,User_account) VALUES ('".$caseNumber."',".$departmentID.",".$patientsID.",'".$account."')";
    if ($link->query($dataq) === TRUE) {
    	//更新分部末碼病歷號
    	$dataq = "UPDATE SCCaseNumber SET caseNumber = caseNumber+1 WHERE Department_ID = ".$departmentID;
    	if ($link->query($dataq) === TRUE) {
			if($link->affected_rows > 0){
				return array("code" => 1 , "caseNumber" => $caseNumber);
			}
    	}
    	die(printJson(0,"新增病患資料成功\n病歷號處理失敗，後續新增病患可能造成病歷號重複",""));
    }
    else{
        return array("code" => 0 , "msg" => "新增病患資料失敗");
    }	
}
?>