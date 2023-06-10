<?php
	/*
     * API=3.0 治療類型分頁，取得治療類型
     * 2018-02-03 v1
     * 2019-06-23 v2 權限更新
     */

	/* 初始化：取得共用函式庫、取得輸入資料、資料庫連線 */
    include('shareFunction.php');
    $data = getJsonInput();  
    $link = initDB();
    
    /* 執行功能 */
    $token = $data -> token;
    $departmentID = $data -> departmentID;
    $codeAdmin = "03-2-新增、編輯全區治療類型";
    $userAdmin = getAccount($link,$token,$codeAdmin);
    $codeNormal = "00-0-預設權限";
    $userNormal = getAccount($link,$token,$codeNormal);
    if($userNormal == null){
        die(printJson(0, "無 $codeNormal 權限", ""));
    }
    $isAdmin = $userAdmin != null;

    $mappingArray = getMappingData($link);
    $result=array(
        'treatmentType' => getTreatmentType($link,$isAdmin,$mappingArray)
    );
    printJson(1,"",$result);

/* 取得綁定的mapping資料 */
function getMappingData($link){
    //取得分部轉換表
    $departmentMapping = getDepartmentMapping($link);

    //查詢治療類型綁定資料
    $priceSql = "SELECT TreatmentType_ID,Department_ID,COUNT(*) as sum "
                ."FROM TreatmentPrice WHERE status = 1";
    /*
    if(!$isAdmin){
        $priceSql = $priceSql." AND Department_ID = ".$departmentID;
    }*/
    $priceSql = $priceSql." GROUP BY TreatmentType_ID,Department_ID";
    $result1 = mysqli_query($link,$priceSql);

    //透過mapping陣列的key(治療類型ID),value(綁定的資料)，提供治療類型array使用
    $mappingArray = array();
    if($result1 && mysqli_num_rows($result1) > 0){
        while($row = mysqli_fetch_assoc($result1)){
            $single = array(
                'departmentName' => $departmentMapping[$row["Department_ID"]],
                'departmentID' => $row["Department_ID"],
                'bindCount' => $row["sum"],      
            );
            //key-value初始化
            if($mappingArray[$row["TreatmentType_ID"]] == null){
                $mappingArray[$row["TreatmentType_ID"]] = array();
            }
            array_push($mappingArray[$row["TreatmentType_ID"]] , $single);
        }
    }
    return $mappingArray;
}

/* 取得治療類型資料 */
function getTreatmentType($link,$isAdmin,$mappingArray){
	$treatmentTypeSql = "SELECT * FROM TreatmentType WHERE status = 1";
	$result1 = mysqli_query($link,$treatmentTypeSql);
    if(!$result1 || mysqli_num_rows($result1)==0){
        die(printJson(0, "無治療類型資料", ""));;
    }
    $treatmentTypeArray = array();
    while($row=mysqli_fetch_assoc($result1)){
        $single = array(
            'ID' => $row["ID"],
            'name' => $row["name"],
            'canEdit' => $isAdmin,
            'bind' => $mappingArray[$row["ID"]]  
        );
        array_push($treatmentTypeArray , $single);
    }
    return $treatmentTypeArray;
}
?>