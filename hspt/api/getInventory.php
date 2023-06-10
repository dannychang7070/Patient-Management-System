<?php
	/*
     * API=4.1 商品分頁，取得庫存資料
     * 2018-05-01 v1
     * 2019-06-23 v2 權限更新
     */

	/* 初始化：取得共用函式庫、取得輸入資料、資料庫連線 */
    include('shareFunction.php');
    $data = getJsonInput();  
    $link = initDB();
    
    /* 執行功能 */
    $token = $data -> token;
    $merchandiseID = $data -> merchandiseID;

    $merchandise = getMerchandise($link,$merchandiseID);
    $codeAdmin = "04-2-取得全區庫存";
    $userAdmin = getAccount($link,$token,$codeAdmin);
    /* 目前僅限管理者可查庫存
    $codeLocal = "04-2-取得單位庫存";
    $userLocal = getAccount($link,$token,$codeLocal);
    */
    if(checkData($userAdmin,$userLocal,$merchandise)){
    	$mappingDepartment = getDepartmentMapping($link);
        $result=array(
            'list' => getInventory($link,$merchandiseID),
            'merchandise' => array(
            	'ID' => $merchandise["ID"],
	            'name' => $merchandise["name"],
	            'size' => $merchandise["size"],
	            'departmentID' => $merchandise["Department_ID"],
	            'departmentName' => $mappingDepartment[$merchandise["Department_ID"]],
	            'remaining' => $merchandise["remaining"],
	            'warning' => $merchandise["warning"],
	            'price' => $merchandise["price"]
        	)
        );
        printJson(1,"",$result);
    }
    else{
       die(printJson(0, "無 $codeAdmin 權限", "")); 
    }    

/* 檢查使用者帳號 */
function checkData($userAdmin,$userNormal,$merchandise){
    if ($merchandise == null) {
    	die(printJson(0, "查無商品", ""));
    }
    else if($userAdmin == null && $userNormal["Department_ID"] != $merchandise["Department_ID"]){
    	return false;
    }
    return true;
}
/* 取得商品資料 */
function getMerchandise($link,$merchandiseID){
	$sql = "SELECT * FROM Merchandise WHERE ID = ".$merchandiseID." AND status = 1 ";
	$result = mysqli_query($link,$sql);
	if(!$result || mysqli_num_rows($result)==0){
        return;
    }
    while($row=mysqli_fetch_assoc($result)){
        return $row;
    }
}
/* 取得商品庫存 */
function getInventory($link,$merchandiseID){
	$sql = "SELECT * FROM MerchandiseRecord WHERE Merchandise_ID = ".$merchandiseID." AND status = 1 ";
	$result = mysqli_query($link,$sql);
    $merchandiseArray = array();

    if(!$result || mysqli_num_rows($result)==0){
        return;
    }
    while($row=mysqli_fetch_assoc($result)){
        $single = array(
            'ID' => $row["ID"],
            'time' => $row["time"],
            'type' => $row["type"] == 1 ? "入庫" : "盤點",
            'amount' => $row["amount"],
            'totalCost' => $row["cost"],
            'unitCost' => $row["cost"]/$row["amount"],
            'account' => $row["User_account1"],
        );
        array_push($merchandiseArray , $single);
    }
    return $merchandiseArray;
}
?>