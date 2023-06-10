<?php
	/*
     * API=3.0 治療分頁，刪除治療
     * 2018-02-03 v1
     * 2019-06-01 v2 權限更新
     */

	/* 初始化：取得共用函式庫、取得輸入資料、資料庫連線 */
    include('shareFunction.php');
    $data = getJsonInput();  
    $link = initDB();
    
    /* 執行功能 */
    $token = $data -> token;
    $treatmentID = $data -> treatmentID;

    $codeAdmin = "03-3-刪除全區治療項目";
    $userAdmin = getAccount($link,$token,$codeAdmin);
    if($userAdmin == null){
        die(printJson(0, "無 $codeAdmin 權限", ""));
    }

    $result = deleteData($link,$treatmentID);
    printJson($result["code"],$result["msg"],"");

/* 假刪該筆症狀資料 */
function deleteData($link,$treatmentID){
	$data = "UPDATE Treatment SET status = 0 WHERE ID = ".$treatmentID." AND status = 1";
	if ($link->query($data) === TRUE) {
		if($link->affected_rows > 0){
			return array("code" => 1 , "msg" => "刪除治療資料成功");
		}
		else return array("code" => 0 , "msg" => "刪除治療資料失敗，查無資料");
    }
    else{
        return array("code" => 0 , "msg" => "刪除治療資料失敗");
    } 
}
?>