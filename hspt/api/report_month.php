<?php
	/*
     * API=4.0 報表：月報 reportMonth
    */
    
    //{"account":"admin","from":"2018-06-01","to":"2018-06-30"}

    /* 初始化：取得共用函式庫、取得輸入資料、資料庫連線 */
    include('shareFunction.php');
    $data = getJsonInput();  
    $link=initDB();

    /* 執行功能 */
    $token = $data -> token;
    $departmentID = $data -> departmentID;//查詢的分部ID
    $from = $data -> from;
    $to = $data -> to;

    $codeAdmin = "05-2-全區月報表";
    $userAdmin = getAccount($link,$token,$codeAdmin);
    $codeLocal = "05-2-單位月報表";
    $userLocal = getAccount($link,$token,$codeLocal);
    
    if($userLocal == null || $userAdmin == null){
        die(printJson(0, "無 $codeLocal 權限", ""));
    }
    else if($userAdmin == null && $departmentID != $userLocal["Department_ID"]){
        die(printJson(0, "無 $codeAdmin 權限", ""));
    }


    $finishT = getReportTreatment($link,$from,$to,$departmentID);
    if(COUNT($finishT)>0){
        $finishMCharge = getReportMerchandiseCharge($link,$from,$to,$finishT,$departmentID);
        $finishMCost = getReportMerchandiseCost($link,$from,$to,$finishMCharge,$departmentID);
        printJson(1, "", dataToRow($link,$finishMCost));
    }
    else{
        printJson(0, "查無資料", "");
    }

//取得診療紀錄
function getReportTreatment($link,$from,$to,$departmentID){
	$sql = "SELECT a.User_account1,c.name AS 'tName',Count(Distinct a.ID) as 'pNumber',SUM(d1.charge) AS 'tCharge'
            FROM CaseHistory AS a
            -- 關聯病患
            JOIN CaseDepartment as b1 ON a.CaseDepartment_ID = b1.ID
            -- 關聯診療師
            JOIN User as c ON a.User_account1 = c.account
            -- 關聯診療
            LEFT JOIN CaseTreatment AS d1 ON a.ID = d1.CaseHistory_ID AND d1.isDelete = 0
            -- 搜尋條件
            WHERE DATE(a.time) >= '$from' AND DATE(a.time) <= '$to' AND b1.Department_ID = $departmentID 
            -- 群組條件
            GROUP BY a.User_account1";

    $result=mysqli_query($link,$sql);
    if(!$result || mysqli_num_rows($result)==0){
        return;
    }

    $treatmentData=array();
    while($row=mysqli_fetch_assoc($result)){
    	$User_account1 = $row["User_account1"];
    	$single = array();
        $single[0] = $row["tName"];
        $single[1] = $row["pNumber"];
        $single[2] = $row["tCharge"];
        $treatmentData[$User_account1] = $single;
    }
    return $treatmentData;
}
//取得商品營收
function getReportMerchandiseCharge($link,$from,$to,$reportData,$departmentID){
	$sql = "SELECT a.User_account1,SUM(e.charge) AS 'mCharge'
            FROM CaseHistory AS a 
            -- 關聯病患
            JOIN CaseDepartment as b1 ON a.CaseDepartment_ID = b1.ID
            -- 關聯商品營收
            LEFT JOIN CaseMerchandise AS e ON a.ID = e.CaseHistory_ID AND e.isDelete = 0
            -- 搜尋條件
            WHERE DATE(a.time) >= '$from' AND DATE(a.time) <= '$to' AND b1.Department_ID = $departmentID
            -- 群組條件
            GROUP BY a.User_account1";

    $result=mysqli_query($link,$sql);
    if(!$result || mysqli_num_rows($result)==0){
        return;
    }
    while($row=mysqli_fetch_assoc($result)){
    	$User_account1 = $row["User_account1"];
    	$single = $reportData[$User_account1];
    	$single[3] = $row["mCharge"];
    	$reportData[$User_account1] = $single;
    }
    return $reportData;

}
//取得商品成本
function getReportMerchandiseCost($link,$from,$to,$reportData,$departmentID){
	$sql = "SELECT a.User_account1,SUM(g.unitcost*f.amount) AS 'mCost'
            FROM CaseHistory AS a 
            -- 關聯病患
            JOIN CaseDepartment as b1 ON a.CaseDepartment_ID = b1.ID
            -- 關聯商品營收
            LEFT JOIN CaseMerchandise AS e ON a.ID = e.CaseHistory_ID AND e.isDelete = 0
            -- 關聯商品成本
            LEFT JOIN CaseMerchandiseRecord AS f ON e.ID = f.CaseMerchandise_ID AND e.isDelete = 0
            LEFT JOIN MerchandiseRecord AS g ON f.MerchandiseRecord_ID = g.ID
            -- 搜尋條件
            WHERE DATE(a.time) >= '$from' AND DATE(a.time) <= '$to' AND b1.Department_ID = $departmentID
            -- 群組條件
            GROUP BY a.User_account1";

    $result=mysqli_query($link,$sql);
    if(!$result || mysqli_num_rows($result)==0){
        return;
    }
    while($row=mysqli_fetch_assoc($result)){
    	$User_account1 = $row["User_account1"];
    	$single = $reportData[$User_account1];
    	$single[4] = $row["mCost"];
    	$reportData[$User_account1] = $single;
    }
    return $reportData;
}

//組裝成輸出資料
function dataToRow($link,$data){
	$output = array();
    // 標頭
    $mTitle = array("治療師","人次","治療收入","商品收入","商品成本");
    //array_push($output, $mTitle);
    // 內容
	foreach($data as $key => $value){
        $content = "";
        
        for($i = 0; $i < 5; $i++){
            if($value[$i] != null) $content[$mTitle[$i]] = $value[$i];
            else $content[$mTitle[$i]] = "0";
        }
        array_push($output, $content);
	}
    return $output;
}
?>