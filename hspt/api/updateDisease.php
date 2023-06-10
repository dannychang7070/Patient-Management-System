<?php
	/*
     * API=3.0 症狀分頁，新增、編輯症狀
     * 2018-02-02 v1
     * 2020-02-01 完成
     */

	/* 初始化：取得共用函式庫、取得輸入資料、資料庫連線 */
    include('shareFunction.php');
    $data = getJsonInput();  
    $link = initDB();
    
    /* 執行功能 */
    $token = $data -> token;
    $diseaseID = $data -> diseaseID;
    $part = $data -> part;
    $name = $data -> name;
    $old_part = $data -> old_part;
    $old_name = $data -> old_name;
    if($part == null || $name == null) die(printJson(0, "有欄位未輸入", ""));

    $codeNormal = "03-1-新增、編輯全區症狀";
    $userNormal = getAccount($link,$token,$codeNormal);
    if($userNormal == null){
        die(printJson(0, "無 $codeNormal 權限", ""));
    }
	

    $result = array();
    //編輯
    if($diseaseID > 0 && oldDataID($link,$old_part,$old_name) == $diseaseID){
        $result = updateData($link,$diseaseID,$part,$name);
    }
    //新增
    else if($diseaseID == 0){
        $result = insertData($link,$part,$name);
    }
    //編輯但舊資料與資料庫不符
    else{
        die(printJson(0,"資料驗證失敗",""));
    }
    printJson($result["code"],$result["msg"],"");        

/* 新增症狀資料 */
function insertData($link,$part,$name){
	//擋重複新增
	if(oldDataID($link,$part,$name) > 0){
		return array("code" => 0 , "msg" => "已有資料，重複新增");
	}
	//新增資料
	$data = "INSERT INTO Disease (part,name,status) VALUES ('".$part."','".$name."',1)";
    if ($link->query($data) === TRUE) {
		return array("code" => 1 , "msg" => "新增症狀資料成功");
    }
    else{
        return array("code" => 0 , "msg" => "新增症狀資料失敗");
    } 
}
/* 根據舊資料查詢資料庫 */
function oldDataID($link,$part,$name){
	$data = "SELECT * FROM Disease WHERE part = '".$part."'".
            " AND name = '".$name."' AND status = 1";
    $result=mysqli_query($link,$data);
    if(!$result || mysqli_num_rows($result)==0){
        return -1;
    }
    while($row = mysqli_fetch_assoc($result)){
        return $row["ID"];
    }
}
/* 編輯症狀資料 */
function updateData($link,$diseaseID,$part,$name){
    //擋編輯成DB舊資料一致的內容
    if(oldDataID($link,$part,$name) > 0){
        return array("code" => 0 , "msg" => "已有相同資料，無法儲存");
    }
	$data = "UPDATE Disease SET part = '".$part."', name = '".$name."'"
			." WHERE ID = ".$diseaseID;
	//$link->query($data) => 查詢SQL語法是否執行成功
	//$link->affected_rows => 查詢SQL語法執行後影響的資料筆數
	if ($link->query($data) === TRUE) {
		if($link->affected_rows > 0){
			return array("code" => 1 , "msg" => "編輯症狀資料成功");
		}
		else return array("code" => 0 , "msg" => "與原資料相同，不更新資料");
    }
    else{
        return array("code" => 0 , "msg" => "編輯症狀資料失敗");
    }
}
?>