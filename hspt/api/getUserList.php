<?php
	/*
     * API=6.0 取得用戶清單 getUserList.php
     * 2019-06-23 v2 權限更新
    */

	//{"account":"admin"}
	
    /* 初始化：取得共用函式庫、取得輸入資料、資料庫連線 */
    include('shareFunction.php');
    $data = getJsonInput();  
    $link = initDB();

    /* 執行功能 */
    $token = $data -> token;
    $codeAdmin = "06-1-新增使用者";
    $userAdmin = getAccount($link,$token,$codeAdmin);
    if($userAdmin == null){
        die(printJson(0, "無 $codeAdmin 權限", ""));
    }

    printJson(1,"",getUserList($link));

/* 取得用戶資料 */
function getUserList($link){
	//資料列表初始化
	$userArray = array();
	$title = array(
		'ID' => "序號",
		'userName' => "使用者名稱",
		'userAccount' => "使用者帳號",
		'departmentID' => "分部ID",
		'departmentName' => "分部名稱",
		'permissionID' => "權限ID",
		'permissionName' => "權限名稱",
	);
	array_push($userArray , $title);

    $uerSQL = "SELECT a.ID,a.account,a.name AS 'userName',b.ID AS 'permissionID',b.name AS 'permissionName',c.ID AS 'departmentID',c.name AS 'departmentName' FROM `User` AS a "
    	."JOIN Permission AS b ON a.Permission_ID = b.ID "
    	."JOIN Department AS c ON a.Department_ID = c.ID "
    	."WHERE a.status = 1 ORDER BY a.ID";
    $result = mysqli_query($link,$uerSQL);
    
    while($row=mysqli_fetch_assoc($result)){
        $single = array(
            'ID' => $row["ID"],
			'userName' => $row["userName"],
			'userAccount' => $row["account"],
			'departmentID' => $row["departmentID"],
			'departmentName' => $row["departmentName"],
			'permissionID' => $row["permissionID"],
			'permissionName' => $row["permissionName"]
        );
        array_push($userArray , $single);
    }
    return $userArray;
}
?>