<?php
	/*
     * API=3.0 治療分頁，取得治療方法
     * 2018-02-03 v1
     * 2019-06-23 v2 權限更新
     */

	/* 初始化：取得共用函式庫、取得輸入資料、資料庫連線 */
    include('shareFunction.php');
    $data = getJsonInput();  
    $link = initDB();
    
    /* 執行功能 */
    $token = $data -> token;
    $codeAdmin = "03-3-新增、編輯全區治療項目";
    $userAdmin = getAccount($link,$token,$codeAdmin);
    $codeNormal = "00-0-預設權限";
    $userNormal = getAccount($link,$token,$codeNormal);
    $isAdmin = $userAdmin != null;
    if($userNormal == null){
        die(printJson(0, "無 $codeNormal 權限", ""));
    }
    
    $treatmentTypeMapping = getTreatmentTypeMapping($link);
    $data=array(
        'treatment' => getTreatment($link,$isAdmin,$treatmentTypeMapping),
        'treatmentType' => getTreatmentTypeArray($treatmentTypeMapping)
    );
    printJson(1,"",$data);

/* 取得治療方法 */
function getTreatment($link,$isAdmin,$treatmentTypeMapping){
    //查詢治療
    $treatmentSql = "SELECT * FROM Treatment WHERE status = 1 ORDER BY TreatmentType_ID";
    $result1 = mysqli_query($link,$treatmentSql);
    $treatmentArray = array();
    while($row=mysqli_fetch_assoc($result1)){
        $single = array(
            'ID' => $row["ID"],
            'name' => $row["name"],
            'treatmentTypeID' => $row["TreatmentType_ID"],
            'treatmentTypeName' => $treatmentTypeMapping[$row["TreatmentType_ID"]],
            'canEdit' => $isAdmin,
        );
        array_push($treatmentArray , $single);
    }
    return $treatmentArray;
}

/* 取得治療類型清單 */
function getTreatmentTypeArray($treatmentTypeMapping){
    $treatmentType = array();
    foreach ($treatmentTypeMapping as $key => $value) {
        $single = array(
            'ID' => $key,
            'name' => $value
        );
        array_push($treatmentType , $single);
    }
    return $treatmentType;
}
?>