<?php
	/*
     * API=4.0 商品分頁，新增、編輯商品
     * 2018-02-02 v1
     */

	/* 初始化：取得共用函式庫、取得輸入資料、資料庫連線 */
    include('shareFunction.php');
    $data = getJsonInput();  
    $link = initDB();
    
    /* 執行功能 */
    $token = $data -> token;
    $merchandiseID = $data -> merchandiseID;
    $departmentID = $data -> departmentID;

    $codeAdmin = "04-1-新增、編輯全區商品";
    $userAdmin = getAccount($link,$token,$codeAdmin);
    $codeLocal = "04-1-新增、編輯單位商品";
    $userLocal = getAccount($link,$token,$codeLocal);
    

    if ($userAdmin == null && $userLocal == null){
        die(printJson(0, "無 $codeLocal 權限", ""));
    }
    else if ($userAdmin == null && $userLocal["Department_ID"] != $departmentID){
        die(printJson(0, "無 $codeAdmin 權限", ""));
    }
    $account = $userAdmin != null ? $userAdmin["account"] : $userLocal["account"];
    $keyList = ["name","size","departmentID","warning","price"];
	if(hasEmpty($data,$keyList)) die(printJson(0, "有欄位未輸入", ""));

    $result = array();
    //編輯
    if($merchandiseID > 0 && oldDataID($link,$data) == $merchandiseID){
        //擋編輯成DB舊資料一致的內容
        if(isDuplicate($data,$keyList)) die(printJson(0,"已有相同資料，無法儲存",""));
        $result = updateData($link,$data);
    }
    //新增
    else if($merchandiseID == 0){
        $result = insertData($link,$data,$account);
    }
    //編輯但舊資料與資料庫不符
    else{
        die(printJson(0,"商品資料錯誤",""));
    }
    printJson($result["code"],$result["msg"],"");


/* 檢查輸入資料是否有空值 */
function hasEmpty($data,$keyList){
    foreach ($keyList as $key) {
        if($data -> $key == null) return true;
    }
    return false;
}
/* 檢查新舊資料是否重複 */
function isDuplicate($data,$keyList){
    foreach($keyList as $key){
        $oldKey = "old_".$key;
        if($data -> $key != $data -> $oldKey) return false;
    }
    return true;
}
/* 新增商品資料 */
function insertData($link,$data,$account){
	//擋重複新增
	if(oldDataID($link,$data) > 0){
		return array("code" => 0 , "msg" => "已有資料，重複新增");
	}
	//新增資料
	$sql = "INSERT INTO Merchandise (name,size,Department_ID,warning,price,remaining,User_account1,status) VALUES ('".$data -> name."','".$data -> size."',".$data -> departmentID.",".$data -> warning.",".$data -> price.",0,'".$account."',1)";
    if ($link->query($sql) === TRUE) {
		return array("code" => 1 , "msg" => "新增商品資料成功");
    }
    else{
        return array("code" => 0 , "msg" => "新增商品資料失敗");
    } 
}
/* 根據舊資料查詢資料庫 */
function oldDataID($link,$data){
	$sql = "SELECT * FROM Merchandise WHERE name = '".$data -> old_name."'".
            " AND size = '".$data -> old_size."'".
            " AND Department_ID = ".$data -> old_departmentID.
            " AND warning = ".$data -> old_warning.
            " AND price = ".$data -> old_price." AND status = 1";
    $result=mysqli_query($link,$sql);
    if(!$result || mysqli_num_rows($result)==0){
        return -1;
    }
    while($row = mysqli_fetch_assoc($result)){
        return $row["ID"];
    }
}
/* 編輯商品資料 */
function updateData($link,$data){
	$sql = "UPDATE Merchandise SET name = '".$data -> name."', size = '".$data -> size."'".
            " , Department_ID = ".$data -> departmentID." , warning = ".$data -> warning.
            " , price = ".$data -> price." , UpdateTime = now()".
			" WHERE ID = ".$data -> merchandiseID;
	//$link->query($data) => 查詢SQL語法是否執行成功
	//$link->affected_rows => 查詢SQL語法執行後影響的資料筆數
	if ($link->query($sql) === TRUE) {
		if($link->affected_rows > 0){
			return array("code" => 1 , "msg" => "編輯商品資料成功");
		}
		else return array("code" => 0 , "msg" => "與原資料相同，不更新資料");
    }
    else{
        return array("code" => 0 , "msg" => "編輯商品資料失敗");
    }
}
?>