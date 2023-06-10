<?php
    /*
     * API=4.0 商品分頁，刪除庫存資料
     * 2018-05-01 v1
     * 2019-06-01 v2 權限更新
     */

	/* 初始化：取得共用函式庫、取得輸入資料、資料庫連線 */
    include('shareFunction.php');
    $data = getJsonInput();  
    $link = initDB();
    
    /* 執行功能 */
    $token = $data -> token;
    $inventoryID = $data -> inventoryID;

    $codeAdmin = "04-2-刪除全區庫存";
    $userAdmin = getAccount($link,$token,$codeAdmin);
    if($userAdmin == null){
        die(printJson(0, "無 $codeAdmin 權限", ""));
    }

    $result = deleteData($link,$inventoryID,$account);
    $inventory = getInventory($link,$inventoryID);
    //刪除成功，且該筆庫存資料的數量!=0，更新商品剩餘數量
    if($result["code"] == 1 && $inventory != null && $inventory["amount"] != 0){
        $updateResult = updateMerchandiseRemaining($link,$inventory["Merchandise_ID"],$inventory["amount"]);
        //TODO 更新商品數量失敗，需要回復原本刪除的庫存資料
        if(!$updateResult){
            die(printJson(0, "系統錯誤：刪除庫存成功，更新商品剩餘數量失敗，後續將導致系統異常", ""));
        }
    }
    printJson($result["code"],$result["msg"],"");

/* 假刪該筆庫存資料 */
function deleteData($link,$inventoryID,$account){
	$sql = "UPDATE MerchandiseRecord SET status = 0,deleteTime = now(),User_account2 ='".$account."' WHERE ID = ".$inventoryID." AND status = 1";
    //echo $sql;
	if ($link->query($sql) === TRUE) {
		if($link->affected_rows > 0){
			return array("code" => 1 , "msg" => "刪除庫存資料成功");
		}
		else return array("code" => 0 , "msg" => "刪除庫存資料失敗，查無資料");
    }
    else{
        return array("code" => 0 , "msg" => "刪除庫存資料失敗");
    } 
}

/* 取得庫存資料 */
function getInventory($link,$inventoryID){
    $sql = "SELECT * FROM MerchandiseRecord WHERE ID = ".$inventoryID." AND status = 0 ";
    $result = mysqli_query($link,$sql);
    if(!$result || mysqli_num_rows($result)==0){
        return;
    }
    while($row=mysqli_fetch_assoc($result)){
        return $row;
    }
}

/* (反向)更新商品庫存 */
function updateMerchandiseRemaining($link,$merchandiseID,$amount){
    $sql = "UPDATE Merchandise SET remaining = remaining - ".$amount." WHERE ID = ".$merchandiseID ." AND status = 1";
    if ($link->query($sql) === TRUE) {
        return true;//成功更新資料，或資料無異動
    }
    else{
        return false;//SQL執行失敗
    }
}
?>