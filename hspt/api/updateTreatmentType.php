<?php
   /*
     * API=3.0 治療類型分頁，新增、編輯治療類型
     * 2018-02-03 v1
     */

	/* 初始化：取得共用函式庫、取得輸入資料、資料庫連線 */
    include('shareFunction.php');
    $data = getJsonInput();  
    $link = initDB();
    
    /* 執行功能 */
    $token = $data -> token;

    $treatmentTypeID = $data -> treatmentTypeID;
    $name = $data -> name;
    $old_name = $data -> old_name;
    
	if($name == null) die(printJson(0, "有欄位未輸入", ""));

    $codeNormal = "03-2-新增、編輯全區治療類型";
    $userNormal = getAccount($link,$token,$codeNormal);
    if($userNormal == null){
        die(printJson(0, "無 $codeNormal 權限", ""));
    }

    $result = array();
    //編輯
    if($treatmentTypeID > 0 && oldDataID($link,$old_name) == $treatmentTypeID){
        $result = updateData($link,$name,$treatmentTypeID);
    }
    //新增
    else if($treatmentTypeID == 0){
        $result = insertData($link,$name);
    }
    //編輯但舊資料與資料庫不符
    else{
        die(printJson(0,"資料驗證失敗",""));
    }
    printJson($result["code"],$result["msg"],"");

/* 根據舊資料查詢資料庫 */
function oldDataID($link,$name){
	$data = "SELECT * FROM TreatmentType WHERE name = '".$name."' AND status = 1";
    $result=mysqli_query($link,$data);
    if(!$result || mysqli_num_rows($result)==0){
        return -1;
    }
    while($row = mysqli_fetch_assoc($result)){
        return $row["ID"];
    }
}

/* 編輯治療類型資料 */
function updateData($link,$name,$treatmentTypeID){
    //擋編輯成DB舊資料一致的內容
    if(oldDataID($link,$name) > 0){
        return array("code" => 0 , "msg" => "已有相同資料，無法儲存");
    }
	$data = "UPDATE TreatmentType SET name = '".$name."'"
			." WHERE ID = ".$treatmentTypeID;
	//$link->query($data) => 查詢SQL語法是否執行成功
	//$link->affected_rows => 查詢SQL語法執行後影響的資料筆數
	if ($link->query($data) === TRUE) {
		if($link->affected_rows > 0){
			return array("code" => 1 , "msg" => "編輯治療類型成功");
		}
		else return array("code" => 0 , "msg" => "與原資料相同，不更新資料");
    }
    else{
        return array("code" => 0 , "msg" => "編輯治療類型失敗");
    }
}

/* 新增治療類型資料 */
function insertData($link,$name){
    //擋重複新增
    if(oldDataID($link,$name) > 0){
        return array("code" => 0 , "msg" => "已有資料，重複新增");
    }
    //新增資料
    $data = "INSERT INTO TreatmentType (name,status) VALUES ('".$name."',1)";
    if ($link->query($data) === TRUE) {
        return array("code" => 1 , "msg" => "新增治療類型成功");
    }
    else{
        return array("code" => 0 , "msg" => "新增治療類型失敗");
    } 
}
?>