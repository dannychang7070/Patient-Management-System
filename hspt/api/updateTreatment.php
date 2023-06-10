<?php
    /*
     * API=3.0 治療分頁，新增、編輯治療
     * 2018-02-03 v1
     */

	/* 初始化：取得共用函式庫、取得輸入資料、資料庫連線 */
    include('shareFunction.php');
    $data = getJsonInput();  
    $link = initDB();
    
    /* 執行功能 */
    $token = $data -> token;

    $treatmentID = $data -> treatmentID;
    $name = $data -> name;
    $treatmentTypeID = $data -> treatmentTypeID;

    $old_name = $data -> old_name;
    $old_treatmentTypeID = $data -> old_treatmentTypeID;

    if($treatmentTypeID < 1 || $name == null){
        die(printJson(0, "有欄位未輸入", ""));
    } 

    $codeNormal = "03-3-新增、編輯全區治療項目";
    $userNormal = getAccount($link,$token,$codeNormal);
    if($userNormal == null){
        die(printJson(0, "無 $codeNormal 權限", ""));
    }

	$result = array();
    //編輯
    if($treatmentID > 0 && oldDataID($link,$old_treatmentTypeID,$old_name) == $treatmentID){
        $result = updateData($link,$treatmentID,$name,$treatmentTypeID);
    }
    //新增
    else if($treatmentID == 0){
        $result = insertData($link,$name,$treatmentTypeID);
    }
    //編輯但舊資料與資料庫不符
    else{
        die(printJson(0,"資料驗證失敗",""));
    }
    printJson($result["code"],$result["msg"],"");

/* 根據舊資料查詢資料庫 */
function oldDataID($link,$treatmentTypeID,$name){
	$data = "SELECT * FROM Treatment WHERE TreatmentType_ID = ".$treatmentTypeID.
            " AND name = '".$name."' AND status = 1";
    $result=mysqli_query($link,$data);
    if(!$result || mysqli_num_rows($result)==0){
        return -1;
    }
    while($row = mysqli_fetch_assoc($result)){
        return $row["ID"];
    }
}

/* 編輯治療資料 */
function updateData($link,$treatmentID,$name,$treatmentTypeID){
    //擋編輯成DB舊資料一致的內容
    if(oldDataID($link,$treatmentTypeID,$name) > 0){
        return array("code" => 0 , "msg" => "已有相同資料，無法儲存");
    }
	$data = "UPDATE Treatment SET TreatmentType_ID = ".$treatmentTypeID.", name = '".$name."'"
			." WHERE ID = ".$treatmentID;
	//$link->query($data) => 查詢SQL語法是否執行成功
	//$link->affected_rows => 查詢SQL語法執行後影響的資料筆數
	if ($link->query($data) === TRUE) {
		if($link->affected_rows > 0){
			return array("code" => 1 , "msg" => "編輯治療資料成功");
		}
		else return array("code" => 0 , "msg" => "與原資料相同，不更新資料");
    }
    else{
        return array("code" => 0 , "msg" => "編輯治療資料失敗");
    }
}

/* 新增治療資料 */
function insertData($link,$name,$treatmentTypeID){
    //擋重複新增
    if(oldDataID($link,$treatmentTypeID,$name) > 0){
        return array("code" => 0 , "msg" => "已有資料，重複新增");
    }
    //新增資料
    $data = "INSERT INTO Treatment (TreatmentType_ID,name,status) VALUES (".$treatmentTypeID.",'".$name."',1)";
    if ($link->query($data) === TRUE) {
        return array("code" => 1 , "msg" => "新增治療資料成功");
    }
    else{
        return array("code" => 0 , "msg" => "新增治療資料失敗");
    } 
}
?>