<?php
    /*
     * API=4.0 商品分頁，刪除商品
     * 2018-04-12 v1
     * 2019-06-01 v2 權限更新
     */

	/* 初始化：取得共用函式庫、取得輸入資料、資料庫連線 */
    include('shareFunction.php');
    $data = getJsonInput();  
    $link = initDB();
    
    /* 執行功能 */
    $token = $data -> token;
    $merchandiseID = $data -> merchandiseID;

    $codeAdmin = "04-1-刪除全區商品";
    $userAdmin = getAccount($link,$token,$codeAdmin);
    if($userAdmin != null){
        $result = deleteData($link,$merchandiseID,0);
        printJson($result["code"],$result["msg"],"");
    }
    else{
        $codeLocal = "04-1-刪除單位商品";
        $userLocal = getAccount($link,$token,$codeLocal);
        if($userLocal != null){
            $result = deleteData($link,$merchandiseID,$user["Department_ID"]);
            printJson($result["code"],$result["msg"],"");
        }
        else{
            die(printJson(0, "無 $codeLocal 權限", ""));
        }
    }
    

/* 假刪該筆商品資料 */
function deleteData($link,$merchandiseID,$departmentID){
	$data = "UPDATE Merchandise SET status = 0 WHERE ID = ".$merchandiseID." AND status = 1";
    if($departmentID > 0){
        $data .= " AND Department_ID = $departmentID";
    }

	if ($link->query($data) === TRUE) {
		if($link->affected_rows > 0){
			return array("code" => 1 , "msg" => "刪除商品資料成功");
		}
		else return array("code" => 0 , "msg" => "刪除商品資料失敗，查無資料");
    }
    else{
        return array("code" => 0 , "msg" => "刪除商品資料失敗");
    } 
}
?>