<?php
    /*
     * 共用函式庫
     * 2017-07-02 v1 By陳志鴻 完成
     * 2017-08-12 v2 增加部分函數
     * 2018-02-02 v3 新增列舉轉換函數
     */

/* 資料庫連線初始化 */
function initDB(){
    include('conn.inc');//connect DB Alpha環境
    if(!$link) include('../db/connectDB.inc');//connect DB Beta環境
    mysqli_query($link,'SET CHARACTER SET UTF8');
    mysqli_query($link,"SET collation_connection='utf8_unicode_ci'");
    if ($link == null) {
        die(printJson(0, "無法連線資料庫", ""));
    }
    return $link;
}
/* 資料輸出(將JSON結果印出在網頁上) */
function printJson($code,$msg,$data){
    $arr = array(
	   'code' => $code,
	   'msg' => $msg,
       'data' => $data
	);
    $json_string = json_encode($arr);
    echo $json_string;
}
/* 取得傳入資料，並做基本檢查 */
function getJsonInput(){
    $json = file_get_contents('php://input');
    checkSQLInjection($json);//針對SQL injection防範
    $data = @json_decode($json);
    //檢查傳入是否為JSON格式
    if ($data === null || json_last_error() !== JSON_ERROR_NONE) {
        header($_SERVER["SERVER_PROTOCOL"]." 404 Not Found", true, 404);
        die();
    }
    else{
        header('Content-type: application/json');
        return $data;
    }
}
/* 針對SQL injection防範 */
function checkSQLInjection($data){
    if (strpos($data, '\'') !== false OR strpos($data,'%27') !== false){
    	header($_SERVER["SERVER_PROTOCOL"]." 404 Not Found", true, 404);
        die();
    }
    else if(strpos($data, '=') !== false){
    	header($_SERVER["SERVER_PROTOCOL"]." 404 Not Found", true, 404);
        die();
    }
    else if(strpos($data, '@') !== false){
    	header($_SERVER["SERVER_PROTOCOL"]." 404 Not Found", true, 404);
        die();
    }
}

/* 取得使用者帳號 */
function getAccount($link,$token,$code){
    $codeMapping = array(
        '00-0-預設權限' => "p00",
        '06-1-新增使用者' => "p01",
        '06-1-修改使用者權限' => "p01",
        '06-1-重設使用者密碼' => "p01",
        '06-1-刪除使用者' => "p01",
        '06-2-新增權限角色' => "p01",
        '06-2-編輯權限角色' => "p01",
        '05-1-全區日報表' => "p17",
        '05-1-單位日報表' => "p18",
        '05-2-全區月報表' => "p19",
        '05-2-單位月報表' => "p20",
        '05-3-全區商品報表' => "p21",
        '05-3-單位商品報表' => "p22",
        '04-1-取得全區商品' => "p05",
        '04-1-取得單位商品' => "p07",
        '04-1-新增、編輯全區商品' => "p05",
        '04-1-新增、編輯單位商品' => "p07",
        '04-1-刪除全區商品' => "p05",
        '04-1-刪除單位商品' => "p07",
        '04-2-新增全區庫存' => "p15",
        '04-2-新增單位庫存' => "p14",
        '04-2-刪除全區庫存' => "p16",
        '04-2-刪除單位庫存' => "p14",
        '04-2-取得全區庫存' => "p16",
        '04-2-取得單位庫存' => "p14",
        '03-1-新增、編輯全區症狀' => "p04",
        '03-1-刪除全區症狀' => "p04",
        '03-2-新增、編輯全區治療類型' => "p04",
        '03-2-刪除全區治療類型' => "p04",
        '03-3-新增、編輯全區治療項目' => "p04",
        '03-3-刪除全區治療項目' => "p04",
        '03-4-取得全區症狀價格綁定' => "p04",
        '03-4-新增、編輯全區症狀價格綁定' => "p04",
        '03-4-新增、編輯單位症狀價格綁定' => "p06",
        '03-4-刪除全區症狀價格綁定' => "p04",
        '03-4-刪除單位症狀價格綁定' => "p06",
        '01-1-編輯病患資料' => "p00",
        '01-1-檢視全區病歷資料' => "p01",
        '01-1-檢視單位病歷資料' => "p01",
        '01-1-新增全區病患' => "p01",
        '01-2-取得跨區治療師' => "p01",
        '01-2-取得單位治療師' => "p01",
        '01-3-刪除區域病歷' => "p04",
        '01-2-新增跨區治療師病歷' => "p01",
        '01-2-新增單位治療師病歷' => "p04"
    );

    if($codeMapping[$code] == null){ 
        die(printJson(0, "查無 $code 權限", "")); 
    }
    if($token == ''){
        print_r($token);
        print_r($code);
        die(printJson(2, "token過期，請重新登入 111", ""));
    }
    $sql = "SELECT a.*, b.$codeMapping[$code] FROM `User` AS a
            JOIN `Permission` as B ON b.ID = a.Permission_ID
            WHERE a.token = '$token' AND a.status = 1 
            AND a.token IS NOT NULL AND a.token != '' 
            AND b.status = 1";

    $result=mysqli_query($link,$sql);
    // 未登入(token查無用戶)
    if(!$result || mysqli_num_rows($result)==0){ 
        die(printJson(2, "尚未登入", ""));
    }
    while($row = mysqli_fetch_assoc($result)){
        $now = new DateTime('now');
        $expireTime = new DateTime($row["expireTime"]);
        
        // token過期
        if($expireTime < $now){
            die(printJson(2, "token過期，請重新登入", ""));
        }
        // 無權限
        if($row[$codeMapping[$code]] != 1){
            return null;
        }
        // 有權限且token未過期
        extendExpireTime($link,$token);
        return $row;
    }
}

/* 延長token到期時間 */
function extendExpireTime($link,$token){
    $sql = "UPDATE User SET expireTime = DATE_ADD(NOW(), INTERVAL 1 HOUR) WHERE token = '$token'";
    $link->query($sql);
}

/* 取得特定分部的使用者帳號
    1.先驗證是否為管理者帳號type=1，是=直接回傳該user
    2.否=用account departmentID組合去查，是否有該user
 */
function getAccountByDepartmentID($link,$account,$departmentID){
    $user = getAccount($link,$account);
    if($user["type"] == 1){
        return $user;
    }
    else{
        $dataq = "SELECT * FROM User WHERE account='".$account."' and Department_ID=".$departmentID." and status=1";
        $result = mysqli_query($link,$dataq);
        if(!$result || mysqli_num_rows($result)==0){
            return;
        }
        while($row = mysqli_fetch_assoc($result)){
            return $row;
        }
    }  
}
/* 取得病患資料 */
function getPatient($link,$department_patientID){
    $dataq="SELECT Patients.*,CaseDepartment.Department_ID "
            ."FROM CaseDepartment "
            ."JOIN Patients ON CaseDepartment.Patients_ID=Patients.ID "
            ."WHERE CaseDepartment.ID=".$department_patientID;
    $result=mysqli_query($link,$dataq);
    if(!$result || mysqli_num_rows($result)==0){
        return;
    }
    while($row = mysqli_fetch_assoc($result)){
        return $row;
    }
}
/* 產生輸出的病患資料 */
function getPatientData($patient){
    if(!$patient){
        die(printJson(0, "查無該病患資料", ""));
    }
    else{
        $patientData = array(
            'name' => $patient["name"],
            'birthday' => $patient["birthday"],
            'gender' => $patient["gender"],
            'phone1' => $patient["phone1"],
            'phone2' => $patient["phone2"],
            'address' => $patient["address"],
            'note' => $patient["note"]
        );
        return $patientData;
    }
}
/* 取得該就醫編號的診療紀錄 */
function getCaseTreatment($link,$caseHistory_ID){
    $data1="SELECT * FROM CaseTreatment "
            ."WHERE CaseHistory_ID=".$caseHistory_ID." AND isDelete = 0 "
            ."ORDER BY Disease_ID,TreatmentPrice_ID";

    $result1=mysqli_query($link,$data1);
    if(!$result1 || mysqli_num_rows($result1)==0){
        return;
    }
    $treatmentData=array();
    while($row=mysqli_fetch_assoc($result1)){
        $single = array(
            'ID' => $row["ID"],
            'diseaseID' => $row["Disease_ID"],
            'packageID' => $row["TreatmentPrice_ID"],
            'treatmentID' => $row["Treatment_ID"],
            'treatmentTypeID' => $row["TreatmentType_ID"],
            'price' => $row["price"],
            'charge' => $row["charge"]
        );
        array_push($treatmentData , $single);
    }
    return $treatmentData;
}
/* 取得該就醫編號的商品紀錄 */
function getCaseMerchandise($link,$caseHistory_ID){
    $data1="SELECT * FROM CaseMerchandise "
            ."WHERE CaseHistory_ID=".$caseHistory_ID." AND isDelete = 0 "
            ."ORDER BY CaseHistory_ID";

    $result1=mysqli_query($link,$data1);
    if(!$result1 || mysqli_num_rows($result1)==0){
        return;
    }
    $merchandiseData=array();
    while($row=mysqli_fetch_assoc($result1)){
        $single = array(
            'ID' => $row["ID"],
            'merchandiseID' => $row["Merchandise_ID"],
            'amount' => $row["amount"],
            'price' => $row["price"],
            'charge' => $row["charge"]
        );
        array_push($merchandiseData , $single);
    }
    return $merchandiseData;
}
/* 分部列舉轉換陣列 */
function getDepartmentMapping($link){
    $data = "SELECT * FROM Department WHERE status = 1";
    $result1=mysqli_query($link,$data);
    if(!$result1 || mysqli_num_rows($result1)==0){
        return;
    }
    $departmentData=array();
    while($row=mysqli_fetch_assoc($result1)){
        $departmentData[$row["ID"]] = $row["name"];
    }
    return $departmentData;
}
/* 取得症狀列舉轉換資料 */
function getDiseaseMapping($link){
    $data = "SELECT * FROM Disease WHERE status = 1";
    $result1=mysqli_query($link,$data);
    if(!$result1 || mysqli_num_rows($result1)==0){
        return;
    }
    $diseaseData=array();
    while($row=mysqli_fetch_assoc($result1)){
        $diseaseData[$row["ID"]] = $row["part"]." ".$row["name"];
    }
    return $diseaseData;
}

/* 治療類型列舉轉換陣列 */
function getTreatmentTypeMapping($link){
    $data = "SELECT * FROM TreatmentType WHERE status = 1";
    $result1=mysqli_query($link,$data);
    if(!$result1 || mysqli_num_rows($result1)==0){
        return;
    }
    $treatmentTypeData=array();
    while($row=mysqli_fetch_assoc($result1)){
        $treatmentTypeData[$row["ID"]] = $row["name"];
    }
    return $treatmentTypeData;
}

/* 治療列舉轉換陣列 */
function getTreatmentMapping($link){
    $sql = "SELECT * FROM Treatment";
    $result = mysqli_query($link,$sql);
    if(!$result || mysqli_num_rows($result)==0){
        return;
    }
    $treatmentData = array();
    while($row=mysqli_fetch_assoc($result)){
        $treatmentData[$row["ID"]] = $row["name"];
    }
    return $treatmentData;
}
/* 檢查是否有該key與對應的value存在 */
function checkEmptyByKeyListOrKey($data,$keyListOrKey){
    if(is_string($keyListOrKey)){
        // data沒有存在該key值或者對應的value為空
        if(!array_key_exists($keyListOrKey,$data)){
            return true;
        } 
        else if($data -> $keyListOrKey == null) return true;
    }
    else{
        foreach ($keyListOrKey as $key) {
            if(!array_key_exists($key,$data)){
                return true;
            } 
            else if($data -> $key == null){
                return true;
            } 
        }
    }
    return false;
}
?>