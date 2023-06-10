<?php
	/*
		API=1.0 2.0 取得分店病患
		2016-10-01 v1 By陳志鴻 完成第一版
		2016-10-12 T  By陳志鴻 DB修正後測試，OK
		2016-12-24 v2 By陳志鴻 1.修正「該帳號無法查詢病歷」的判斷式。2.對應DB欄位名稱修正
		2017-07-02 v3 新增共用函式庫
		2017-08-12 v4 支援關鍵字搜尋
		2017-12-17 v5 修正輸入中文無法搜尋生日問題
	*/
	
	/* 初始化：取得共用函式庫、取得輸入資料、資料庫連線 */
    include('shareFunction.php');
    $data = getJsonInput();  
    $link=initDB();
	
    /* 執行功能 */
    $token = $data -> token;

    $codeNormal = "00-0-預設權限";
    $userNormal = getAccount($link,$token,$codeNormal);
	
	if($userNormal == null){
        die(printJson(0, "無 $codeNormal 權限", ""));
    }
    
	$departmentArray = getDepartment($link,$userNormal);//回傳的分部清單
	$dapartCase=getDepartmentPatient($link,$departmentArray,$data -> searchWord);//二維陣列，儲存所有的分部病患
	$result = array();//輸出資料
	
	//判斷分部病患是否為空，是=從departmentArray移除該分部
	for($i=0 ;$i<count($dapartCase);$i++){
		if(count($dapartCase[$i])==0){
			unset($departmentArray[$i]);
		}
	}
	
	/* 將JSON結果印出在網頁上 */
	if(count($departmentArray)==0){ 
		printJson(0, "查無分部病患", "");
	}
	else{
		//分部:分部病患array(如果該array count=0，則略過)
		for($i=0;$i<count($dapartCase);$i++){
			if(count($dapartCase[$i])>0){
				$result[$departmentArray[$i]["name"]]=$dapartCase[$i];
			}
		}
		//分部array
		$result["department"]=array_values($departmentArray);
		
		printJson(1, "", $result);
	}

/* 取得帳號可查詢的分部清單 */
function getDepartment($link,$user){
	if($user == NULL){
		die(printJson(0, "該帳號無法查詢病歷", ""));
	}

	$departmentArray = array();
	if($user["type"] > 0 && $user["type"] < 5){
		//身份：分店店長、治療師、會計，可以取得該分店的所有分部病患
		$dataq = "SELECT * FROM Department WHERE ID=".$user["Department_ID"];
		if($user["type"] == 1){
			//身份:管理者，可以取得所有分店病患
			$dataq = "SELECT * FROM `Department` WHERE `status`=1";	
		}
		$result=mysqli_query($link,$dataq);
		if(!$result || mysqli_num_rows($result)==0){
			die(printJson(0, "無可查詢分店", ""));
    	}

		while($row=mysqli_fetch_assoc($result)){
			$department=array(
				'ID' => $row["ID"],
				'name' => $row["name"],
			);
			array_push($departmentArray , $department);
		}
	}
	return $departmentArray;
}

/* 取得分部病患 */
function getDepartmentPatient($link,$departmentArray,$searchText){
	$dapartCase = array();
	for($i=0 ; $i<count($departmentArray) ; $i++){
		$singleDepCase=array();//單一分部的分部病患
		$dataq = getDepartmentPatientSQL($departmentArray[$i]["ID"],$searchText);
		$result=mysqli_query($link,$dataq);
		if($result){
			while($row=mysqli_fetch_assoc($result)){
				$patients=array(
					'department_patientID' => $row["ID"],
					'caseNumber' => $row["caseNumber"],
					'name' => $row["name"],
					'birthday' => $row["birthday"],
					'gender' => $row["gender"],
					'phone1' => $row["phone1"],
					'phone2' => $row["phone2"],
					'department' => $departmentArray[$i]["name"],
				);
				array_push( $singleDepCase , $patients );
			}
		}
		array_push( $dapartCase , $singleDepCase );
	}
	return $dapartCase;
}

/* 產生查詢病患SQL語法 */
function getDepartmentPatientSQL($departmentID,$searchText){

	$sql = "SELECT a.ID,a.caseNumber,"
			."b.name,b.birthday,b.gender,b.phone1,b.phone2 "
			."FROM CaseDepartment a,Patients b "
			."WHERE a.Department_ID=".$departmentID
			." and a.Patients_ID=b.ID";
	if(strlen($searchText) > 0){
		//純數字搜尋所有符合條件欄位
		if(preg_match("/^[0-9]*$/", $searchText)){
			$search = " and ("
				 ." a.caseNumber LIKE '%".$searchText."%' OR "
				 ." b.name LIKE '%".$searchText."%' OR "
				 ." b.birthday = '".$searchText."' OR "
				 ." b.phone1 LIKE '%".$searchText."%' OR "
				 ." b.phone2 LIKE '%".$searchText."%' "
				 .")";
			return $sql.$search;
		}
		//非數字搜尋病歷號、姓名
		else{
			$search = " and ("
				 ." a.caseNumber LIKE '%".$searchText."%' OR "
				 ." b.name LIKE '%".$searchText."%' "
				 .")";
			return $sql.$search;
		}
	}
	return $sql;
}
?> 