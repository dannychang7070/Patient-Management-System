<?php
	/*
     * API=4.0 報表：日報 reportDaily
    */

    //{"account":"admin","date":"2018-06-09"}

    /* 初始化：取得共用函式庫、取得輸入資料、資料庫連線 */
    include('shareFunction.php');
    $data = getJsonInput();  
    $link=initDB();

    /* 執行功能 */
    $token = $data -> token;
    $departmentID = $data -> departmentID;//查詢的分部ID
    $date = $data -> date;
    $codeAdmin = "05-1-全區日報表";
    $userAdmin = getAccount($link,$token,$codeAdmin);
    $codeLocal = "05-1-單位日報表";
    $userLocal = getAccount($link,$token,$codeLocal);
    
    if($userLocal == null || $userAdmin == null){
        die(printJson(0, "無 $codeLocal 權限", ""));
    }
    else if($userAdmin == null && $departmentID != $userLocal["Department_ID"]){
        die(printJson(0, "無 $codeAdmin 權限", ""));
    }


    $typeMapping = getTreatmentTypeList($link);
    $index = 3 + COUNT($typeMapping);//商品的array起始位置
    $finishT = getReportTreatment($link,$date,$typeMapping,$departmentID);
    if(COUNT($finishT)>0){
        $finishMCharge = getReportMerchandiseCharge($link,$date,$finishT,$index,$departmentID);
        $finishMCost = getReportMerchandiseCost($link,$date,$finishMCharge,$index,$departmentID);
        printJson(1, "", dataToRow($link,$finishMCost));
    }
    else{
        printJson(0, "查無資料", "");
    }

//取得診療紀錄
function getReportTreatment($link,$date,$typeMapping,$departmentID){
	$sql = "SELECT c.name AS 'tName' ,b2.name AS 'pName', a.ID, d2.TreatmentType_ID, SUM(d1.charge) AS 'tCharge'
			FROM CaseHistory AS a
			-- 關聯病患
			JOIN CaseDepartment as b1 ON a.CaseDepartment_ID = b1.ID
			JOIN Patients as b2 ON b1.Patients_ID = b2.ID
			-- 關聯診療師
			JOIN User as c ON a.User_account1 = c.account
			-- 關聯診療
			LEFT JOIN CaseTreatment AS d1 ON a.ID = d1.CaseHistory_ID AND d1.isDelete = 0
			JOIN TreatmentPrice AS d2 ON d1.TreatmentPrice_ID = d2.ID
			-- 搜尋條件
			WHERE DATE(a.time) = '$date' AND b1.Department_ID = $departmentID
			-- 群組條件
			GROUP BY a.ID,d2.TreatmentType_ID";

    $result=mysqli_query($link,$sql);
    if(!$result || mysqli_num_rows($result)==0){
        return;
    }

    $treatmentData=array();
    while($row=mysqli_fetch_assoc($result)){
    	$id = $row["ID"];
    	if($treatmentData[$id] == NULL){
    		$single = array();
    		$single[0] = $row["tName"];
    		$single[1] = $row["pName"];
    		$single[2] = $id;
    		$single[$typeMapping[$row["TreatmentType_ID"]]] = $row["tCharge"];
    		$treatmentData[$id] = $single;
    	}
    	else{
    		$single = $treatmentData[$id];
    		$single[$typeMapping[$row["TreatmentType_ID"]]] = $row["tCharge"];
    		$treatmentData[$id] = $single;
    	}
    }
    return $treatmentData;
}
//取得商品營收
function getReportMerchandiseCharge($link,$date,$reportData,$index){
	$sql = "SELECT a.ID,SUM(e.charge) AS 'mCharge'
			FROM CaseHistory AS a
			-- 關聯商品營收
			LEFT JOIN CaseMerchandise AS e ON a.ID = e.CaseHistory_ID AND e.isDelete = 0
			-- 搜尋條件
			WHERE DATE(a.time) = '$date'
			-- 群組條件
			GROUP BY a.ID";

    $result=mysqli_query($link,$sql);
    if(!$result || mysqli_num_rows($result)==0){
        return;
    }
    while($row=mysqli_fetch_assoc($result)){
    	$id = $row["ID"];
    	$single = $reportData[$id];
        if($single != null){
            $single[$index] = $row["mCharge"];
            $reportData[$id] = $single;
        }
    	
    }
    return $reportData;

}
//取得商品成本
function getReportMerchandiseCost($link,$date,$reportData,$index){
	$sql = "SELECT a.ID,SUM(g.unitcost*f.amount) AS 'mCost'
			FROM CaseHistory AS a
			-- 關聯商品營收
			LEFT JOIN CaseMerchandise AS e ON a.ID = e.CaseHistory_ID AND e.isDelete = 0
			-- 關聯商品成本
			LEFT JOIN CaseMerchandiseRecord AS f ON e.ID = f.CaseMerchandise_ID AND e.isDelete = 0
			LEFT JOIN MerchandiseRecord AS g ON f.MerchandiseRecord_ID = g.ID
			-- 搜尋條件
			WHERE DATE(a.time) = '$date'
			-- 群組條件
			GROUP BY a.ID";

    $result=mysqli_query($link,$sql);
    if(!$result || mysqli_num_rows($result)==0){
        return;
    }
    while($row=mysqli_fetch_assoc($result)){
    	$id = $row["ID"];
    	$single = $reportData[$id];
        if($single != null){
            $single[$index+1] = $row["mCost"];
            $reportData[$id] = $single;
        }
    }
    return $reportData;
}
//取得治療類型Mappimg資料
function getTreatmentTypeList($link){
	$sql = "SELECT * FROM TreatmentType";
    $result=mysqli_query($link,$sql);
    if(!$result || mysqli_num_rows($result)==0){
        return;
    }
    $treatmentTypeData=array();
    $flag = 3;
    while($row=mysqli_fetch_assoc($result)){
        $treatmentTypeData[$row["ID"]] = $flag++;
    }
    return $treatmentTypeData;
}

//取得治療類型標頭資料
function getTreatmentTypeListTitle($link){
    $sql = "SELECT * FROM TreatmentType";
    $result=mysqli_query($link,$sql);
    if(!$result || mysqli_num_rows($result)==0){
        return;
    }
    $treatmentTypeData=array();
    $flag = 3;
    while($row=mysqli_fetch_assoc($result)){
        array_push($treatmentTypeData, $row["name"]);
    }
    return $treatmentTypeData;
}

//組裝成輸出資料
function dataToRow($link,$data){
	$output = array();
    // 標頭
    $mTitle = array("治療師","病患名稱","病歷序號");
    $tType = getTreatmentTypeListTitle($link);
    foreach ($tType as $tName) {array_push($mTitle, $tName);}
    array_push($mTitle, "商品營收","商品成本(預售商品無成本)");
    //array_push($output, $mTitle);

    // 內容
	foreach ($data as $key => $value){
        $content = array();

        for($i = 0; $i < COUNT($tType)+5; $i++){
            if($value[$i] != null) $content[$mTitle[$i]] = $value[$i];
            else $content[$mTitle[$i]] = "0";
        }
        array_push($output, $content);
	}
    return $output;
}
?>