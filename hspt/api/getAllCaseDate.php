<?php
    /*
     * API=2.0 取得病患歷史就醫日期 getAllCaseDate 
     * 2017-04-09 v1 By陳志鴻 完成
     * 2017-06-17 v2 新增病歷權限判讀
     * 2017-07-02 v3 新增共用函式庫
     * 2017-08-06 v4 目前最終版
    */

    /* 防破解設定
     * 1.如果帳號非管理者帳號，查詢病患非同分部時，只回傳錯誤訊息
     */

    /* 初始化：取得共用函式庫、取得輸入資料、資料庫連線 */
    include('shareFunction.php');
    $data = getJsonInput();  
    $link=initDB();
    
    /* 執行功能 */
    $token = $data -> token;
    $departmentID = $data -> departmentID;

    $codeAdmin = "01-1-檢視全區病歷資料";
    $userAdmin = getAccount($link,$token,$codeAdmin);
    
    $codeLocal = "01-1-檢視單位病歷資料";
    $userLocal = getAccount($link,$token,$codeLocal);
    $isAdmin = $userAdmin != null || $userLocal != null;

    $codeNormal = "00-0-預設權限";
    $userNormal = getAccount($link,$token,$codeNormal);
    $account = $userNormal["account"];

    if($userAdmin != null || $userNormal["Department_ID"] == $departmentID){
        $department_patientID = $data -> department_patientID;
        $patient = getPatient($link,$department_patientID);
        $patientsData = getPatientData($patient);
        if($patientsData != null){
            $case = getCaseDate($department_patientID,$isAdmin,$account,$link);
            $result = array(
                'patientsData' => $patientsData,
                'case' => $case
            );
            printJson(1, "", $result);
        }
    }
    else if ($userNormal == null){
        die(printJson(0, "無 $codeNormal 權限", ""));
    }
    else {
        die(printJson(0, "無 $codeAdmin 權限", ""));
    }
    
//取得病患在所有分部的就醫日期
function getCaseDate($patientID,$isAdmin,$account,$link){
    //取得就醫日期
    $data1="SELECT * 
        FROM CaseHistory 
        WHERE CaseDepartment_ID = $patientID 
        ORDER BY time DESC";
	$result1=mysqli_query($link,$data1);

	if(!$result1 || mysqli_num_rows($result1)==0){
        return;//回傳空值
    }
    else{
        $case=array();
           
        while($row=mysqli_fetch_assoc($result1)){
            $msg = "";
            if (!$isAdmin && $account != $row["User_account2"] && $account != $row["User_account1"])
            {
                $msg = "權限不足";
            } 
            $single = array(
                'date' => $row["time"],
                'caseHistory_ID' => $row["ID"],
                'msg' => $msg
            );
            array_push($case , $single);
        }
    return $case;
    }
}


?> 