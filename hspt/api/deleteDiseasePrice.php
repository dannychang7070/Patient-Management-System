<?php
    /*
     * API=3.0 價格綁定分頁，刪除價格綁定
     * 2018-02-02 v1
     * 2019-06-01 v2 權限更新
     */

	/* 初始化：取得共用函式庫、取得輸入資料、資料庫連線 */
    include('shareFunction.php');
    $data = getJsonInput();  
    $link = initDB();
    
    /* 執行功能 */
    $token = $data -> token;
    $priceID = $data -> priceID;

    $codeAdmin = "03-4-刪除全區症狀價格綁定";
    $userAdmin = getAccount($link,$token,$codeAdmin);
    if($userAdmin != null){
        $result = deleteData($link,$priceID,0);
        printJson($result["code"],$result["msg"],"");
    }
    else{
        $codeLocal = "03-4-刪除單位症狀價格綁定";
        $userLocal = getAccount($link,$token,$codeLocal);
        if($userLocal != null){
            $result = deleteData($link,$priceID,$user["Department_ID"]);
            printJson($result["code"],$result["msg"],"");
        }
        else{
            die(printJson(0, "無 $codeLocal 權限", ""));
        }
    }

/* 假刪該筆價格綁定資料 */
function deleteData($link,$priceID,$departmentID){
	$data = "UPDATE TreatmentPrice SET status = 0 WHERE ID = $priceID AND status = 1";
    if($departmentID > 0){
        $data.= " AND Department_ID = $departmentID";
    }
	if ($link->query($data) === TRUE) {
		if($link->affected_rows > 0){
			return array("code" => 1 , "msg" => "刪除價格綁定資料成功");
		}
		else return array("code" => 0 , "msg" => "刪除價格綁定資料失敗，查無資料");
    }
    else{
        return array("code" => 0 , "msg" => "刪除價格綁定資料失敗");
    } 
}
?>