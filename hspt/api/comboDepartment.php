<?php
	/*
     * API=下拉選單，分部(無使用者權限篩選)
     * 2018-03-03 v1
     * 2019-06-23 v2 權限更新
     */

	/* 初始化：取得共用函式庫、資料庫連線 */
    include('shareFunction.php');
    $data = getJsonInput();  
    $link = initDB();
    
    /* 執行功能 */
    $token = $data -> token;
    $codeNormal = "00-0-預設權限";
    $userNormal = getAccount($link,$token,$codeNormal);
    if($userNormal == null){
        die(printJson(0, "無 $codeNormal 權限", ""));
    }

    $data=array(
        'department' => getMappingData(getDepartmentMapping($link))
    );
    if(COUNT($data["department"]) > 0) printJson(1,"",$data);
    else printJson(0,"查無資料",null);
    
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
?>