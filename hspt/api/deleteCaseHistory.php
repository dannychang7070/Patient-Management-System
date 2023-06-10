<?php
	/*
     * API=1.3 檢視病歷，刪除病歷
     * 2020-03-01 v1
     */

	/* 初始化：取得共用函式庫、取得輸入資料、資料庫連線 */
    include('shareFunction.php');
    $data = getJsonInput();  
    $link = initDB();
    
    /* 執行功能 */
    $token = $data -> token;
    $caseHistory_ID = $data -> caseID;

    $codeLocal = "01-3-刪除區域病歷";
    $userLocal = getAccount($link,$token,$codeLocal);
    if($userLocal == null){
        die(printJson(0, "無 $codeLocal 權限", ""));
    }
    // step1.刪除病歷主表
    $result = deleteCaseHistory($link, $caseHistory_ID, $userLocal["account"]);
    if ($result["code"] == 0) die(printJson($result["code"],$result["msg"],""));
    // step2.刪除對應診療
    $result = deleteCaseTreatment($link, $caseHistory_ID, $userLocal["account"]);
    if ($result["code"] == 0) die(printJson($result["code"],$result["msg"],""));
    // step3.刪除商品
    $result = updateMerchandise($link, $caseHistory_ID);
    if ($result["code"] == 0) die(printJson($result["code"],$result["msg"],""));
    else if ($result["code"] == 1){
    	$result = deleteCaseMerchandise($link, $caseHistory_ID, $userLocal["account"]);
    	if ($result["code"] == 0) die(printJson($result["code"],$result["msg"],""));
    }
    // step4.刪除商品對應庫存連動
    $result = updateMerchandiseRecord($link, $caseHistory_ID);
    if ($result["code"] == 0) die(printJson($result["code"],$result["msg"],""));
    else if ($result["code"] == 1){
    	$result = deleteCaseMerchandiserecord($link, $caseHistory_ID, $userLocal["account"]);
    	if ($result["code"] == 0) die(printJson($result["code"],$result["msg"],""));
    }
    // step5.輸出成功
    printJson(1,"刪除病歷成功","");

/* 刪除病歷主表 */
function deleteCaseHistory($link,$caseHistory_ID,$account){
	$sql = "UPDATE CaseHistory 
		SET isDelete = true, User_account3 = '$account', updateTime = CURRENT_TIMESTAMP() 
		WHERE ID = $caseHistory_ID AND isDelete = false";
	if ($link->query($sql) === TRUE) {
		if($link->affected_rows > 0){
			return array("code" => 1 , "msg" => "刪除病歷主表成功");
		}
		else return array("code" => 0 , "msg" => "刪除病歷主表失敗，查無資料");
    }
    else{
        return array("code" => 0 , "msg" => "刪除病歷主表失敗");
    } 
}

/* 刪除病歷診療 */
function deleteCaseTreatment($link,$caseHistory_ID,$account){
	$sql = "UPDATE CaseTreatment 
		SET isDelete = true, User_account2 = '$account', updateTime = CURRENT_TIMESTAMP 
		WHERE CaseHistory_ID = $caseHistory_ID AND isDelete = false";
	if ($link->query($sql) === TRUE) {
		if($link->affected_rows > 0){
			return array("code" => 1 , "msg" => "刪除病歷診療成功");
		}
		return array("code" => 1 , "msg" => "無病歷診療");
    }
    else{
        return array("code" => 0 , "msg" => "刪除病歷診療失敗");
    }
}
/* 回補商品主表 */
function updateMerchandise($link, $caseHistory_ID){
	$sql = "UPDATE Merchandise AS a
		SET a.remaining = a.remaining + (
			SELECT b.amount 
			FROM CaseMerchandise AS b
			WHERE b.Merchandise_ID = a.ID
		) 
		WHERE a.ID IN (
			SELECT c.Merchandise_ID 
			FROM CaseMerchandise AS c
			WHERE c.CaseHistory_ID = $caseHistory_ID AND c.isDelete = false 
			GROUP BY c.Merchandise_ID
		)";

    if ($link->query($sql) === TRUE) {
		if($link->affected_rows > 0){
			return array("code" => 1 , "msg" => "回補商品主表成功");
		}
		else {
			return array("code" => 2 , "msg" => "無需要回補商品");
		}
    }
    else{
        return array("code" => 0 , "msg" => "回補商品主表失敗");
    }
}
/* 刪除病歷商品 */
function deleteCaseMerchandise($link,$caseHistory_ID,$account){
	$sql = "UPDATE CaseMerchandise 
		SET isDelete = true, User_account2 = '$account', updateTime = CURRENT_TIMESTAMP 
		WHERE CaseHistory_ID = $caseHistory_ID AND isDelete = false";
	if ($link->query($sql) === TRUE) {
		if($link->affected_rows > 0){
			return array("code" => 1 , "msg" => "刪除病歷商品成功");
		}
    }
    else{
        return array("code" => 0 , "msg" => "刪除病歷商品失敗");
    }
}
/* 回補商品庫存 */
function updateMerchandiseRecord($link, $caseHistory_ID){
	$sql = "UPDATE MerchandiseRecord AS a 
		SET a.remaining = a.remaining + (
			SELECT b.amount 
			FROM CaseMerchandiseRecord AS b 
			WHERE b.MerchandiseRecord_ID = a.ID
		) 
		WHERE a.ID IN (
			SELECT c.MerchandiseRecord_ID 
			FROM CaseMerchandiseRecord AS c 
			JOIN CaseMerchandise AS d ON c.CaseMerchandise_ID = d.ID 
			WHERE c.isDelete = false AND d.CaseHistory_ID = $caseHistory_ID
			GROUP BY c.MerchandiseRecord_ID
		)";

    if ($link->query($sql) === TRUE) {
		if($link->affected_rows > 0){
			return array("code" => 1 , "msg" => "回補商品庫存成功");
		}
		else {
			return array("code" => 2 , "msg" => "無需要回補庫存");
		}
    }
    else{
        return array("code" => 0 , "msg" => "回補商品庫存失敗");
    }
}
/* 刪除病歷商品連動庫存紀錄 */
function deleteCaseMerchandiserecord($link,$caseHistory_ID,$account){
	$sql = "UPDATE CaseMerchandiseRecord 
		SET isDelete = true, User_account2 = '$account', updateTime = CURRENT_TIMESTAMP 
		WHERE CaseMerchandise_ID IN (
			SELECT ID 
			FROM CaseMerchandise 
			WHERE CaseHistory_ID = $caseHistory_ID
        	GROUP BY ID
		)";
	if ($link->query($sql) === TRUE) {
		if($link->affected_rows > 0){
			return array("code" => 1 , "msg" => "刪除病歷商品連動庫存成功");
		}
    }
    else{
        return array("code" => 0 , "msg" => "刪除病歷商品連動庫存失敗");
    }
}


?>