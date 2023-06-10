<?php
	/*
     * API=4.0 商品分頁，取得商品
     * 2018-04-12 v1
     * 2019-06-23 v2 權限更新
     */

	/* 初始化：取得共用函式庫、取得輸入資料、資料庫連線 */
    include('shareFunction.php');
    $data = getJsonInput();  
    $link = initDB();
    
    /* 執行功能 */
    $token = $data -> token;
    $codeAdmin = "04-1-取得全區商品";
    $userAdmin = getAccount($link,$token,$codeAdmin);
    $codeNormal = "00-0-預設權限";
    $userNormal = getAccount($link,$token,$codeNormal);
    $isAdmin = $userAdmin != null;

    if($userAdmin == null && $userNormal == null){
        die(printJson(0, "無 $codeNormal 權限", ""));
    }
    $mappingDepartment = getDepartmentMapping($link);
    $sql = getMerchandiseSQL($isAdmin,$userNormal["Department_ID"],$data);
    $result=array(
        'merchandise' => getMerchandise($link,$mappingDepartment,$sql,$isAdmin),
        'department' => getMappingData($mappingDepartment)
    );
    printJson(1,"",$result);

/* 檢查使用者帳號 */
function checkData($user,$departmentID){
    if($user == null){
        die(printJson(0, "非法帳號", ""));
    }
    return true;
}
/* 取得商品資料 */
function getMerchandise($link,$mappingDepartment,$sql,$isAdmin){
	$result = mysqli_query($link,$sql);
	
    $merchandiseArray = array();
    while($row=mysqli_fetch_assoc($result)){
        $single = array(
            'ID' => $row["ID"],
            'name' => $row["name"],
            'size' => $row["size"],
            'departmentID' => $row["Department_ID"],
            'departmentName' => $mappingDepartment[$row["Department_ID"]],
            'remaining' => $row["remaining"],
            'warning' => $row["warning"],
            'price' => $row["price"],
            'isWarning' => $row["remaining"]<$row["warning"],
            'canEdit' => $isAdmin
        );
        array_push($merchandiseArray , $single);
    }
    return $merchandiseArray;
}
/* 組合商品SQL */
function getMerchandiseSQL($isAdmin,$departmentID,$data){
	//搜尋參數
	$name = $data -> name;
	$size = $data -> size;
	$isOnlyWarning = $data -> isOnlyWarning;
	$keyword = $data -> keyword;

	//SQL語法
	$sql = "SELECT * FROM Merchandise WHERE status = 1 ";
	if(strlen($name) >0){
		$sql = $sql." AND name ='".$name."' ";
	}
	if(strlen($size) >0){
		$sql = $sql." AND size ='".$size."' ";
	}
	if($isOnlyWarning){
		$sql = $sql." AND remaining < warning ";
	}
	if(strlen($keyword) >0){
		$sql = $sql." AND (name LIKE '%".$keyword."%' OR size LIKE '%".$keyword."%')";
	}
	if(!$isAdmin){
		$sql = $sql." AND Department_ID = ".$departmentID;
	}
	$sql = $sql." ORDER BY ID,Department_ID";
	return $sql;
}
/* 從mapping array轉換成字典籍 */
function getMappingData($mappingArray){
    $dic = array();
    foreach ($mappingArray as $key => $value) {
        $single = array(
            'ID' => $key,
            'name' => $value
        );
        array_push($dic , $single);
    }
    return $dic;
}
?>