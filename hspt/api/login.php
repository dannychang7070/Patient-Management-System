<?php
    /*
     * API=0.0 登入
     * 2016-10-01 v1 By陳志鴻 完成第一版
     * 2016-10-12 T  By陳志鴻 DB修正後測試，OK
     * 2016-10-12 v2 By陳志鴻 新增區塊 Debug模式 
     * 2016-12-24 v3 By陳志鴻 1.修正「查無此帳號」的判斷式。2.對應DB欄位名稱修正
     * 2017-02-09 v4 By陳志鴻 修正架構，以function為主體的架構
     * 2017-07-02 v3 新增共用函式庫
     * 2017-07-30 v4 結構調整
    */

    /* 測試JSON
     * {"account": "admin", "password": "123456"}
     * {"account": "admin", "password": "hspt"}
     */

	/* 初始化：取得共用函式庫、取得輸入資料、資料庫連線 */
    include('shareFunction.php');
    $data = getJsonInput();  
    $link=initDB();
    
    /* 執行功能 */
    login($data,$link);
	
/* 檢查是否有該使用者、帳密是否正確 */
function login($data,$link){
    $account = $data -> account;
    $password = $data -> password;
    $token = bin2hex(openssl_random_pseudo_bytes(16));
    $data = "UPDATE User SET token = '$token' WHERE account = '$account' AND password = '$password'";
    //$link->query($data) => 查詢SQL語法是否執行成功
    //$link->affected_rows => 查詢SQL語法執行後影響的資料筆數
    if ($link->query($data) === TRUE && $link->affected_rows > 0) {
        extendExpireTime($link,$token);
        printJson(1,"登入成功",$token);
    }
    else{
        printJson(0,"帳號或密碼錯誤",null);
    }
}
?> 