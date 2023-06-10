<?php
    /*
     * API=3.0 症狀分頁，刪除症狀
     * 2018-02-02 v1
     * 2019-06-01 v2 權限更新
     */

	/* 初始化：取得共用函式庫、取得輸入資料、資料庫連線 */
    include('shareFunction.php');
    $data = getJsonInput();  
    $link = initDB();
    
    /* 執行功能 */
    $token = $data -> token;
    $diseaseID = $data -> diseaseID;

    $codeAdmin = "03-1-刪除全區症狀";
    $userAdmin = getAccount($link,$token,$codeAdmin);
    if($userAdmin == null){
        die(printJson(0, "無 $codeAdmin 權限", ""));
    }
/*
    $codeLocal = "";
    $userLocal = getAccount($link,$token,$codeLocal);
    $codeNormal = "";
    $userNormal = getAccount($link,$token,$codeNormal);
*/
    $result = deleteData($link,$diseaseID);
    printJson($result["code"],$result["msg"],"");


/* 假刪該筆症狀資料 */
function deleteData($link,$diseaseID){
	$data = "UPDATE Disease SET status = 0 WHERE ID = ".$diseaseID." AND status = 1";
	if ($link->query($data) === TRUE) {
		if($link->affected_rows > 0){
			return array("code" => 1 , "msg" => "刪除症狀資料成功");
		}
		else return array("code" => 0 , "msg" => "刪除症狀資料失敗，查無資料");
    }
    else{
        return array("code" => 0 , "msg" => "刪除症狀資料失敗");
    } 
}
?>