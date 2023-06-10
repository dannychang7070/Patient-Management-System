<?php
	/*
     * API=6.0 重設密碼 resetPassword.php
    */

	// 管理者重設密碼
	// {"token":"admin","ID":1}
	// 使用者更換成新密碼
	// {"token":"admin","ID":1,"oldPassword":"hspt","newPassword":"hspt1"}
	
    /* 初始化：取得共用函式庫、取得輸入資料、資料庫連線 */
    include('shareFunction.php');
    $data = getJsonInput();  
    $link = initDB();

	/* 執行功能 */
    $token = $data -> token;
    $ID = $data -> ID;

    $codeAdmin = "06-1-重設使用者密碼";
    $userAdmin = getAccount($link,$token,$codeAdmin);

    $codeNormal = "00-0-預設權限";
    $userNormal = getAccount($link,$token,$codeNormal);

	$keyList = ["oldPassword","newPassword"];
	
	// 使用者更換成新密碼
	if(!checkEmptyByKeyListOrKey($data,$keyList) && checkSelfAccount($userNormal,$ID)){
		if($data -> oldPassword == $data -> newPassword){
			printJson(0,"舊密碼不可與新密碼相同","");
		}
		else if(updatePassword($link,$data)){
			printJson(1,"","");
		}
		else{
			printJson(0,"密碼錯誤","");
		}
	}
	// 管理者重設密碼
	else if($userAdmin != null){
		if(resetPassword($link,$data)){
			printJson(1,"","");
		}
		else{
			printJson(0,"重設失敗(查無對應資料)","");
		}
	}
	else{
		die(printJson(0, "有欄位未填寫", ""));
	}
		

/* 檢查是否為自己的帳號 */
function checkSelfAccount($user,$ID){
    if($user == null){
        die(printJson(0, "非法帳號", ""));
    }
    else if($user["ID"] != $ID){
        die(printJson(0, "該帳號無法「重設他人密碼」", ""));
    }
    return true;
}

/* 使用者更新密碼 */
function updatePassword($link,$data){
	$ID = $data -> ID;
	$oldPassword = $data -> oldPassword;
	$newPassword = $data -> newPassword;
    $sql = "UPDATE User SET password = '$newPassword' WHERE ID = $ID AND password = '$oldPassword'";
    if($link->query($sql) === TRUE && $link->affected_rows > 0) return true;
}

/* 管理者重設密碼 */
function resetPassword($link,$data){
	$ID = $data -> ID;
    $sql = "UPDATE User SET password = 'hspt' WHERE ID = $ID";
    if($link->query($sql) === TRUE && $link->affected_rows > 0) return true;
}
?>