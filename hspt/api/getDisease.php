<?php
	/*
     * API=3.0 症狀分頁，取得症狀
     * 2018-02-02 v1
     * 2019-06-01 v2 權限更新
     */

	/* 初始化：取得共用函式庫、取得輸入資料、資料庫連線 */
    include('shareFunction.php');
    $data = getJsonInput();  
    $link = initDB();
    
    /* 執行功能 */
    $token = $data -> token;
    $codeAdmin = "03-1-新增、編輯全區症狀";
    $userAdmin = getAccount($link,$token,$codeAdmin);
    $codeNormal = "00-0-預設權限";
    $userNormal = getAccount($link,$token,$codeNormal);
    $isAdmin = $userAdmin != null;

    if($userNormal == null){
        die(printJson(0, "無 $codeNormal 權限", ""));
    }

    $mappingArray = getMappingData($link);
    $result=array(
        'disease' => getDisease($link,$isAdmin,$mappingArray)
    );
    printJson(1,"",$result);
   
/* 取得綁定的mapping資料 */
function getMappingData($link){
    //取得分部轉換表
    $departmentMapping = getDepartmentMapping($link);

    //查詢症狀綁定資料
    $priceSql = "SELECT Disease_ID,Department_ID,COUNT(*) as sum "
                ."FROM TreatmentPrice WHERE status = 1";

    $priceSql = $priceSql." GROUP BY Disease_ID,Department_ID";
    $result1 = mysqli_query($link,$priceSql);

    //透過mapping陣列的key(症狀ID),value(綁定的資料)，提供症狀array使用
    $mappingArray = array();
    if($result1 && mysqli_num_rows($result1) > 0){
        while($row = mysqli_fetch_assoc($result1)){
            $single = array(
                'departmentName' => $departmentMapping[$row["Department_ID"]],
                'departmentID' => $row["Department_ID"],
                'bindCount' => $row["sum"],      
            );
            //key-value初始化
            if($mappingArray[$row["Disease_ID"]] == null){
                $mappingArray[$row["Disease_ID"]] = array();
            }
            array_push($mappingArray[$row["Disease_ID"]] , $single);
        }
    }
    return $mappingArray;
}
/* 取得症狀資料 */
function getDisease($link,$isAdmin,$mappingArray){
	$diseaseSql = "SELECT * FROM Disease WHERE status = 1";
	$result1 = mysqli_query($link,$diseaseSql);
    if(!$result1 || mysqli_num_rows($result1)==0){
        die(printJson(0, "無症狀資料", ""));;
    }
    $diseaseArray = array();
    while($row=mysqli_fetch_assoc($result1)){
        $single = array(
            'ID' => $row["ID"],
            'part' => $row["part"],
            'name' => $row["name"],
            'canEdit' => $isAdmin,
            'bind' => $mappingArray[$row["ID"]]  
        );
        array_push($diseaseArray , $single);
    }
    return $diseaseArray;
}
?>