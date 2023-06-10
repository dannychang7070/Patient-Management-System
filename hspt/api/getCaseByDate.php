<?php
// 待修正為新版
    /*
     * API=2.0 取得病患某日就醫紀錄 getCaseByDate 
     * 2017-04-09 v1 By陳志鴻 完成，沒有處理權限問題
     * 2017-06-18 v2 已完成權限處理
     * 2017-06-18 v3 針對資料庫欄位異動，修正
     * 2017-07-02 v4 新增共用函式庫
     * 2017-07-08 v5 新增canEdit欄位，只有管理者、店長為true
     * 2017-07-08 v6 clean code 處理
     * 2017-08-12 v7 取資料與轉輸出資料函數拆開(最終版)
    */

    /* 初始化：取得共用函式庫、取得輸入資料、資料庫連線 */
    include('shareFunction.php');
    $data = getJsonInput();  
    $link = initDB();
    
    /* 執行功能 */
    $token = $data -> token;
    $date = $data -> date;
    $caseHistory_ID = $data -> caseHistory_ID;
    $departmentID = $data -> departmentID;

    $codeAdmin = "01-1-檢視全區病歷資料";
    $userAdmin = getAccount($link,$token,$codeAdmin);
    
    $codeLocal = "01-1-檢視單位病歷資料";
    $userLocal = getAccount($link,$token,$codeLocal);
    $isAdmin = $userAdmin != null || $userLocal != null;

    $codeNormal = "00-0-預設權限";
    $userNormal = getAccount($link,$token,$codeNormal);
    $account = $userNormal["account"];

    $caseHistory = getCaseHistory($link, $data);
    if($userAdmin == null || $userNormal["Department_ID"] != $departmentID){
        die(printJson(0, "無 $codeAdmin 權限", ""));
    }
    else if ($userLocal == null && $caseHistory["User_account1"] != $userNormal["account"] && $caseHistory["User_account2"] != $userNormal["account"]){
        die(printJson(0, "無 $codeLocal 權限", ""));
    }
    $treatmentMapping = getTreatmentMapping($link);
    $caseTreatment = transIDToName($treatmentMapping,getCaseTreatmentRecord($link,$caseHistory_ID));
    $caseMerchandise = getCaseMerchandiseRecord($link,$caseHistory_ID);

    $result= array(
        'caseHistory_ID' => $caseHistory_ID,
        'note' => $caseHistory["note"],
        'record' => array_merge($caseTreatment, $caseMerchandise)
    );
    printJson(1, "", $result);

//取得病歷資料
function getCaseHistory($link,$data){
    $date = $data -> date;
    $caseHistory_ID = $data -> caseHistory_ID;

    //判斷該就醫編號與日期是否正確
    $data1 = "SELECT * 
        FROM CaseHistory 
        WHERE ID = $caseHistory_ID AND time ='$date'";

	$result1 = mysqli_query($link,$data1);
	if(!$result1 || mysqli_num_rows($result1)==0){
        die(printJson(0, "該就醫編號與日期查無資料", ""));
    }
    while($row = mysqli_fetch_assoc($result1)){
        return $row;
    }
}
    
//取得該就醫編號的診療紀錄
function getCaseTreatmentRecord($link,$caseHistoryID){
    $treatmentData = array();

    $sql = "SELECT a.*, b.part, b.name AS bName, c.name AS cName
        FROM CaseTreatment AS a 
        JOIN Disease AS b ON b.ID = a.Disease_ID 
        JOIN TreatmentPrice AS d ON d.ID = a.TreatmentPrice_ID
        JOIN TreatmentType AS c ON c.ID = d.TreatmentType_ID 
        WHERE CaseHistory_ID = $caseHistoryID";
    $result = mysqli_query($link,$sql);
    if(!$result || mysqli_num_rows($result) == 0){
        return;
    }
    
    while($row = mysqli_fetch_assoc($result)){
        $single = array(
            'ID' => $row["ID"],
            'title' => $row["part"] . " - " . $row["bName"],
            'treatmentType' => $row["cName"],
            'treatmentIds' => $row["Treatment_ID"],
            'price' => $row["price"],
            'charge' => $row["charge"]
        );
        array_push($treatmentData , $single);
    }
    return $treatmentData;
    
}
// 治療ID轉換為治療名稱
function transIDToName($mapping,$list){    
    $result = array();
    foreach ($list as $single) {
        $treatmentIds = explode(",",$single["treatmentIds"]);
        $names = array();
        foreach ($treatmentIds as $id) {
            array_push($names, $mapping[$id]);
        }

        $new = array(
            'ID' => $single["ID"],
            'type' => "診療",
            'title' => $single["title"],
            'detail' => $single["treatmentType"] . " - " . implode( "、", $names),
            'amount' => "1",
            'price' => $single["price"],
            'charge' => $single["charge"]
        );
        array_push($result , $new);
    }
    
    return $result;
}
//取得該就醫編號的商品紀錄
function getCaseMerchandiseRecord($link,$caseHistoryID){
    $sql = "SELECT a.*, b.size, b.name AS bName
        FROM CaseMerchandise AS a 
        JOIN Merchandise AS b ON b.ID = a.Merchandise_ID 
        WHERE CaseHistory_ID = $caseHistoryID";

    $result = mysqli_query($link,$sql);
    if(!$result || mysqli_num_rows($result) == 0){
        return;
    }

    $merchandiseData = array();
    while($row = mysqli_fetch_assoc($result)){
        $single = array(
            'ID' => $row["ID"],
            'type' => "商品",
            'title' => $row["bName"],
            'detail' => $row["size"],
            'amount' => $row["amount"],
            'price' => $row["price"],
            'charge' => $row["charge"]
        );
        array_push($merchandiseData , $single);
    }
    return $merchandiseData;
}
?> 