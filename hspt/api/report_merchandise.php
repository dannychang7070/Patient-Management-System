<?php
	/*
     * API=4.0 報表：商品報表 report_merchandise
     * 2019-07-07 v2 權限更新
    */
    
    //{"account":"admin","from":"2018-05-01","to":"2018-05-30"}

    /* 初始化：取得共用函式庫、取得輸入資料、資料庫連線 */
    include('shareFunction.php');
    $data = getJsonInput();  
    $link=initDB();

    /* 執行功能 */
    $token = $data -> token;
    $departmentID = $data -> departmentID;//查詢的分部ID
    $from = $data -> from;
    $to = $data -> to;

    $codeAdmin = "05-3-全區商品報表";
    $userAdmin = getAccount($link,$token,$codeAdmin);
    $codeLocal = "05-3-單位商品報表";
    $userLocal = getAccount($link,$token,$codeLocal);
    
    if($userLocal == null || $userAdmin == null){
        die(printJson(0, "無 $codeLocal 權限", ""));
    }
    else if($userAdmin == null && $departmentID != $userLocal["Department_ID"]){
        die(printJson(0, "無 $codeAdmin 權限", ""));
    }

    $finishT = getReportProduct($link,$from,$to,$departmentID);
    if(COUNT($finishT)>0){
        printJson(1, "", dataToRow($link,$finishT));
    }
    else{
        printJson(0, "查無資料", "");
    }

//取得商品營收
function getReportProduct($link,$from,$to,$departmentID){
	$sql = "SELECT b.name,a.time,a.type,a.amount,a.remaining,a.unitCost,a.User_account1 
            FROM MerchandiseRecord AS a 
            -- 關聯商品營收
            JOIN Merchandise AS b ON a.Merchandise_ID = b.ID AND b.Department_ID = $departmentID 
            -- 搜尋條件
            WHERE DATE(a.time) >= '$from' AND DATE(a.time) <= '$to' AND a.status = 1";

    $result=mysqli_query($link,$sql);
    if(!$result || mysqli_num_rows($result)==0){
        return;
    }
    $productData=array();
    while($row=mysqli_fetch_assoc($result)){
    	$single = array();
        $single[0] = $row["name"];
        $single[1] = $row["time"];
        $single[2] = $row["type"] == 1 ? "進貨" : "退貨";
        $single[3] = $row["amount"];
        $single[4] = $row["remaining"];
        $single[5] = $row["unitCost"];
        $single[6] = $row["User_account1"];
        array_push($productData,$single);
    }
    return $productData;

}

//組裝成輸出資料
function dataToRow($link,$data){
	$output = array();
    // 標頭
    $mTitle = array("名稱","日期","狀態","進貨數量","當前數量","單件成本","建立者");
    //array_push($output, $mTitle);

    // 內容
	foreach ($data as $key => $value){
        $content = "";
        
        for($i = 0; $i < 7; $i++){
            if($value[$i] != null) $content[$mTitle[$i]] = $value[$i];
            else $content[$mTitle[$i]] = "";
        }
        array_push($output, $content);
	}
    return $output;
}
?>