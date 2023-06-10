<?php
	/*
     * API=3.0 價格綁定分頁，新增、編輯價格綁定
     * 2018-02-06 v1
     */

	/* 初始化：取得共用函式庫、取得輸入資料、資料庫連線 */
    include('shareFunction.php');
    $data = getJsonInput();  
    $link = initDB();
    
    /* 執行功能 */
    $token = $data -> token;

    $priceID = $data -> priceID;
    $diseaseID = $data -> diseaseID;
    $departmentID = $data -> departmentID;
    $treatmentTypeID = $data -> treatmentTypeID;
    $price = $data -> price;

    $old_diseaseID = $data -> old_diseaseID;
    $old_departmentID = $data -> old_departmentID;
    $old_treatmentTypeID = $data -> old_treatmentTypeID;
    $old_price = $data -> old_price;

	if($diseaseID == null || $departmentID == null || $treatmentTypeID == null || $price == null) die(printJson(0, "有欄位未輸入", ""));

    $codeAdmin = "03-4-新增、編輯全區症狀價格綁定";
    $userAdmin = getAccount($link,$token,$codeAdmin);
    if($userAdmin == null){
        $codeLocal = "03-4-新增、編輯單位症狀價格綁定";
        $userLocal = getAccount($link,$token,$codeLocal);
        if($userLocal == null){
            die(printJson(0, "無 $codeLocal 權限", ""));
        }
        else if($departmentID != $old_departmentID || $departmentID != $userLocal["Department_ID"]){
            die(printJson(0, "無 $codeAdmin 權限", ""));
        }
    }

    $result = array();
    //編輯
    if($priceID > 0 && oldDataID($link,$old_diseaseID,$old_departmentID,$old_treatmentTypeID,$old_price) == $priceID){
        $result = updateData($link,$priceID,$diseaseID,$departmentID,$treatmentTypeID,$price);
    }
    //新增
    else if($priceID == 0){
        $result = insertData($link,$diseaseID,$departmentID,$treatmentTypeID,$price);
    }
    //編輯但舊資料與資料庫不符
    else{
        die(printJson(0,"資料驗證失敗",""));
    }
    printJson($result["code"],$result["msg"],"");

/* 根據舊資料查詢資料庫 */
function oldDataID($link,$diseaseID,$departmentID,$treatmentTypeID,$price){
	$data = "SELECT * FROM TreatmentPrice WHERE Disease_ID = ".$diseaseID.
            " AND Department_ID = ".$departmentID.
            " AND TreatmentType_ID = ".$treatmentTypeID.
            " AND price = ".$price." AND status = 1";

    $result=mysqli_query($link,$data);
    if(!$result || mysqli_num_rows($result)==0){
        return -1;
    }
    while($row = mysqli_fetch_assoc($result)){
        return $row["ID"];
    }
}

/* 編輯價格綁定資料 */
function updateData($link,$priceID,$diseaseID,$departmentID,$treatmentTypeID,$price){
    //擋編輯成DB舊資料一致的內容
    if(oldDataID($link,$diseaseID,$departmentID,$treatmentTypeID,$price) > 0){
        return array("code" => 0 , "msg" => "已有相同資料，無法儲存");
    }
	$data = "UPDATE TreatmentPrice SET Disease_ID = ".$diseaseID.
			", Department_ID = ".$departmentID.
			", TreatmentType_ID = ".$treatmentTypeID.
			", price = ".$price.
			" WHERE ID = ".$priceID;
	//$link->query($data) => 查詢SQL語法是否執行成功
	//$link->affected_rows => 查詢SQL語法執行後影響的資料筆數
	if ($link->query($data) === TRUE) {
		if($link->affected_rows > 0){
			return array("code" => 1 , "msg" => "編輯價格綁定資料成功");
		}
		else return array("code" => 0 , "msg" => "與原資料相同，不更新資料");
    }
    else{
        return array("code" => 0 , "msg" => "編輯價格綁定資料失敗");
    }
}

/* 新增症狀資料 */
function insertData($link,$diseaseID,$departmentID,$treatmentTypeID,$price){
	//擋重複新增
	if(oldDataID($link,$diseaseID,$departmentID,$treatmentTypeID,$price) > 0){
		return array("code" => 0 , "msg" => "已有資料，重複新增");
	}
	//新增資料
	$data = "INSERT INTO TreatmentPrice (Disease_ID,Department_ID,TreatmentType_ID,price,status) VALUES (".$diseaseID.",".$departmentID.",".$treatmentTypeID.",".$price.",1)";
    if ($link->query($data) === TRUE) {
		return array("code" => 1 , "msg" => "新增價格綁定資料成功");
    }
    else{
        return array("code" => 0 , "msg" => "新增價格綁定資料失敗");
    } 
}
?>