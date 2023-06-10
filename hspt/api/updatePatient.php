<?php
    /*
     * API=2.0 更新病患資料 updatePatient
     * 2017-07-30 v1 新增共用函式庫
    */


    /* 初始化：取得共用函式庫、取得輸入資料、資料庫連線 */
    include('shareFunction.php');
    $data = getJsonInput();  
    $link = initDB();


    /* 執行功能 */
    $token = $data -> token;
    $patientsData = $data -> data;
    $oldpatientsData = $patientsData -> oldpatientsData;
    $newpatientsData = $patientsData -> newpatientsData;

    $codeNormal = "01-1-編輯病患資料";
    $userNormal = getAccount($link,$token,$codeNormal);

    if($userNormal != null){
        $patientsData = $data -> data;
        $oldpatientsData = $patientsData -> oldpatientsData;
        $newpatientsData = $patientsData -> newpatientsData;
        $patientID = getPatientDbData($link,$data -> department_patientID,$oldpatientsData);
        if($patientID > 0){
            $success = updatePatient($link,$patientID,$newpatientsData);
            if($success){
                printJson(1, "", "");
            }
            else{
                printJson(0, "更新失敗(資料不符)", "");
            }
        }
        else{
            printJson(0, "更新失敗(資料不符)", "");
        }
        
    }
    else{
        die(printJson(0, "無 $codeNormal 權限", ""));
    }

//利用傳入資料去尋找符合條件的病患
function getPatientDbData($link,$department_patientID,$oldpatientsData){
    $name = $oldpatientsData -> name;
    $birthday = $oldpatientsData -> birthday;
    $gender = $oldpatientsData -> gender;
    $phone1 = $oldpatientsData -> phone1;
    $phone2 = $oldpatientsData -> phone2;
    $address = $oldpatientsData -> address;
    $note = $oldpatientsData -> note;

    $dataq = "SELECT b.* FROM CaseDepartment AS a 
              JOIN Patients as b ON a.Patients_ID = b.ID 
              WHERE a.ID = $department_patientID AND b.name = '$name'
                AND b.birthday = '$birthday'
                AND b.gender = '$gender' 
                AND b.phone1 = '$phone1' 
                AND b.phone2 = '$phone2' 
                AND b.address = '$address'
                AND b.note = '$note'";
    $result=mysqli_query($link,$dataq);
    if(!$result || mysqli_num_rows($result)==0){
        return;
    }
    while($row = mysqli_fetch_assoc($result)){
        return $row["ID"];
    }
}

//更新病患資料
function updatePatient($link,$patientID,$newpatientsData){
    $name = $newpatientsData -> name;
    $birthday = $newpatientsData -> birthday;
    $gender = $newpatientsData -> gender;
    $phone1 = $newpatientsData -> phone1;
    $phone2 = $newpatientsData -> phone2;
    $address = $newpatientsData -> address;
    $note = $newpatientsData -> note;

    $dataq = "UPDATE Patients SET name ='$name' 
                ,birthday = '$birthday'
                ,gender = '$gender'
                ,phone1 = '$phone1'
                ,phone2 = '$phone2'
                ,address = '$address'
                ,note = '$note'
                 WHERE ID = $patientID";
    if ($link->query($dataq) === TRUE) {
        return true;
    }
    else{
        return false;
    }
}
?> 