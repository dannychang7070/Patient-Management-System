<?php
	/*
     * API=4.0 商品分頁，新增庫存
     * 2018-05-01 v1
     */

	/* 初始化：取得共用函式庫、取得輸入資料、資料庫連線 */
    include('shareFunction.php');
    $data = getJsonInput();  
    $link = initDB();

    /* 執行功能 */
    $token = $data -> token;
    $merchandiseID = $data -> merchandiseID;

    $codeAdmin = "04-2-新增全區庫存";
    $userAdmin = getAccount($link,$token,$codeAdmin);
    $codeLocal = "04-2-新增單位庫存";
    $userLocal = getAccount($link,$token,$codeLocal);
    
    $merchandise = getMerchandise($link,$merchandiseID);
    $keyList = ["merchandiseID","time","type","amount","cost"];
	if(checkEmptyByKeyListOrKey($data,$keyList)) die(printJson(0, "有欄位未輸入", ""));

    if ($userAdmin == null && $userLocal == null){
        die(printJson(0, "無 $codeLocal 權限", ""));
    }
    else if ($userAdmin == null && $userLocal["Department_ID"] != $merchandise["Department_ID"]){
        die(printJson(0, "無 $codeAdmin 權限", ""));
    }
    else if ($merchandise == null){
        die(printJson(0, "查無商品資料", ""));
    }
    $account = $userAdmin != null ? $userAdmin["account"] : $userLocal["account"];
    
    //新增紀錄
    $result = insertData($link,$data,$account);
    //商品剩餘數量更新
    $amount = $data -> amount;
    if($result["code"] == 1 && $amount != 0){
        $updateResult = updateMerchandiseRemaining($link,$merchandiseID,$amount);
        //TODO 更新商品數量失敗，需要回復原本刪除的庫存資料
        if(!$updateResult){
            die(printJson(0, "系統錯誤：新增庫存成功，更新商品剩餘數量失敗，後續將導致系統異常", ""));
        }
    }
    printJson($result["code"],$result["msg"],"");

/* 取得商品資料 */
function getMerchandise($link,$merchandiseID){
    $sql = "SELECT * FROM Merchandise WHERE ID = ".$merchandiseID." AND status = 1 ";
    $result = mysqli_query($link,$sql);
    if(!$result || mysqli_num_rows($result)==0){
        return;
    }
    while($row=mysqli_fetch_assoc($result)){
        return $row;
    }
}

/* 新增庫存資料 */
function insertData($link,$data,$account){
	//新增資料
	$sql = "INSERT INTO MerchandiseRecord 
            (Merchandise_ID,`time`,type,amount,remaining,cost,unitCost,User_account1,status) 
            VALUES ("
                .$data -> merchandiseID.","
                ."'".$data -> time."',"
                .$data -> type.","
                .$data -> amount.","
                .$data -> amount.","
                .$data -> cost.","
                .$data -> cost/$data -> amount.","
                ."'".$account."',1)";

    if ($link->query($sql) === TRUE) {
		return array(
            "code" => 1 , "msg" => "新增庫存資料成功" , 
            "inventoryID" => $link->insert_id
        );
    }
    else{
        return array("code" => 0 , "msg" => "新增庫存資料失敗");
    } 
}

/* (正向)更新商品庫存 */
function updateMerchandiseRemaining($link,$merchandiseID,$amount){
    $sql = "UPDATE Merchandise SET remaining = remaining + ".$amount." WHERE ID = ".$merchandiseID ." AND status = 1";
    if ($link->query($sql) === TRUE) {
        return true;//成功更新資料，或資料無異動
    }
    else{
        return false;//SQL執行失敗
    }
}
?>