<?php
	/*
     * API=6.0 新增或編輯用戶 updateUser.php
     * API=刪除用戶 updateUser.php
     * 新增時userID=0 編輯時，帶原本的userID
     * 刪除時，帶userID status = "0"
    */

	// insert update
	// {"token":"admin","ID":1,"userName":"管理者","userAccount":"admin","departmentID":1,"permissionID":1}
	// delete
	// {"token":"admin","ID":2,"status":"0"}
	
    /* 初始化：取得共用函式庫、取得輸入資料、資料庫連線 */
    include('shareFunction.php');
    $data = getJsonInput();  
    $link = initDB();

	/* 執行功能 */
    $token = $data -> token;
    $status = $data -> status;
   	$keyList = ["userAccount","userName","permissionID","departmentID"];

	if(!checkEmptyByKeyListOrKey($data,"status") && $status == "0"){
		checkPermission($link,$token,"06-1-刪除使用者",true);
		if(deleteUser($link,$data)){
			printJson(1,"","");
		}
		else{
			printJson(0,"刪除失敗","");
		}
	}
	else if(!checkEmptyByKeyListOrKey($data,$keyList)){
		checkPermission($link,$token,"06-1-新增使用者",true);
		if(updateUser($link,$data)){
			printJson(1,"","");
		}
		else{
			printJson(0,"更新失敗","");
		}
	}
	else{
		die(printJson(0, "有欄位未填寫", ""));
	}

/* 檢查使用者帳號 */
function checkPermission($link,$token,$code,$stopOnError){
	$userAdmin = getAccount($link,$token,$code);
    if($userAdmin == null){
    	if(!$stopOnError) return false;
        die(printJson(0, "無 $codeAdmin 權限", ""));
    }
    return true;
}

/* 新增、更新資料 */
function updateUser($link,$data){
	$ID = $data -> ID;
	$userAccount = $data -> userAccount;
	$userName = $data -> userName;
	$permissionID = $data -> permissionID;
	$departmentID = $data -> departmentID;
	 
	$combin = "($ID,'$userAccount','hspt','$userName',3,$permissionID,$departmentID,1)";
	
    /* ON DUPLICATE KEY UPDATE 當pk重複時update，否則走insert */
    $sql = "INSERT INTO User (`ID`,`account`,`password`,`name`,`type`,`Permission_ID`,`Department_ID`,`status`) VALUES ".$combin." ON DUPLICATE KEY UPDATE account = VALUES(account), password = VALUES(password), name = VALUES(name), type = VALUES(type), Permission_ID = VALUES(Permission_ID), Department_ID = VALUES(Department_ID), status = VALUES(status)";

    if($link->query($sql) === TRUE) return true;
}

/* 假刪資料 */
function deleteUser($link,$data){
	$ID = $data -> ID;
    $sql = "UPDATE User SET status = 0 WHERE ID = $ID";
    if($link->query($sql) === TRUE && $link->affected_rows > 0) return true;
}
?>