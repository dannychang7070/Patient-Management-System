<?php
	/*
     * API=3.0 價格綁定分頁，取得價格資料
     * 2018-02-05 v1
     * 2019-06-23 v2 權限更新
     */

	/* 初始化：取得共用函式庫、取得輸入資料、資料庫連線 */
    include('shareFunction.php');
    $data = getJsonInput();  
    $link = initDB();
    
    /* 執行功能 */
    $token = $data -> token;
    $departmentID = $data -> departmentID;//查詢的分部ID
    $diseaseID = $data -> diseaseID;
    $treatmentTypeID = $data -> treatmentTypeID;

    $codeAdmin = "03-4-取得全區症狀價格綁定";
    $userAdmin = getAccount($link,$token,$codeAdmin);
    $codeNormal = "00-0-預設權限";
    $userNormal = getAccount($link,$token,$codeNormal);
    if($userNormal == null){
        die(printJson(0, "無 $codeNormal 權限", ""));
    }
    $isAdmin = $userAdmin != null;

    //取得mapping的資料
    $mappingDepartment = getDepartmentMapping($link);
    $mappingDisease = getDiseaseMapping($link);
    $mappingTreatmentType = getTreatmentTypeMapping($link);
    $result=array(
        'diseasePrice' => getDiseasePrice($link,$isAdmin,$data,$mappingDepartment,$mappingDisease,$mappingTreatmentType),
        'department' => getMappingData($mappingDepartment),
        'disease' => getMappingData($mappingDisease),
        'treatmentType' => getMappingData($mappingTreatmentType)
    );
    printJson(1,"",$result);

/* 從mapping array轉換成字典籍 */
function getMappingData($mappingArray){
    $dic = array();
    foreach ($mappingArray as $key => $value) {
        $single = array(
            'ID' => $key,
            'name' => $value
        );
        array_push($dic , $single);
    }
    return $dic;
}

/* 取得價格綁定資料 */
function getDiseasePrice($link,$isAdmin,$data,$mDepartment,$mDisease,$mTreatmentType){
	//指定查詢條件(區域變數)
	$departmentID = $data -> departmentID;//查詢的分部ID
    $diseaseID = $data -> diseaseID;
    $treatmentTypeID = $data -> treatmentTypeID;

	$priceSql = "SELECT * FROM TreatmentPrice WHERE status = 1";
	
	//有查詢特定症狀或治療類型時，帶入指定的分部ID
    if($diseaseID > 0 || $treatmentTypeID > 0){
        $priceSql = $priceSql." AND Department_ID = ".$departmentID;
    }
    //查詢特定症狀
    if($diseaseID > 0){
    	$priceSql = $priceSql." AND Disease_ID = ".$diseaseID;
    }
    //查詢特定治療類型
    if($treatmentTypeID > 0){
    	$priceSql = $priceSql." AND TreatmentType_ID = ".$treatmentTypeID;
    }
	
	$result1 = mysqli_query($link,$priceSql);
    if(!$result1 || mysqli_num_rows($result1)==0){
        return;//無價格綁定資料
    }
    $diseasePriceArray = array();
    while($row=mysqli_fetch_assoc($result1)){
        $single = array(
            'ID' => $row["ID"],
            'diseaseID' => $row["Disease_ID"],
            'diseaseName' => $mDisease[$row["Disease_ID"]],
            'departmentID' => $row["Department_ID"],
            'departmentName' => $mDepartment[$row["Department_ID"]],
            'treatmentTypeID' => $row["TreatmentType_ID"],
            'treatmentTypeName' => $mTreatmentType[$row["TreatmentType_ID"]],
            'price' => $row["price"],
            'canEdit' => $isAdmin
        );
        array_push($diseasePriceArray , $single);
    }
    return $diseasePriceArray;
}
?>