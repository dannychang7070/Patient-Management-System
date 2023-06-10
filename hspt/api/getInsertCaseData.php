<?php
    /*
     * API=1.0 2.0 取得新增病歷所需資料
     * 2017-06-10 v1 By陳志鴻 完成第一版
     * 2017-07-02 v2 新增共用函式庫，修正部分錯誤
     * 2017-08-12 v3 修正JSON回傳格式，clean code(最終版)
     */

	
    /* 初始化：取得共用函式庫、取得輸入資料、資料庫連線 */
    include('shareFunction.php');
    $data = getJsonInput();  
    $link=initDB();
    
    /* 執行功能 */
    $token = $data -> token;
    $departmentID = $data -> departmentID;
    $department_patientID = $data -> department_patientID;
    $codeAdmin = "01-2-取得跨區治療師";
    $userAdmin = getAccount($link,$token,$codeAdmin);
    $isAdmin = $userAdmin != null;
    $codeNormal = "00-0-預設權限";
    $userNormal = getAccount($link,$token,$codeNormal);

    if($userNormal == null){
        die(printJson(0, "無 $codeNormal 權限", ""));
    }
    else if(!$isAdmin && $userNormal["Department_ID"] != $departmentID){
        die(printJson(0, "無 查詢跨區 權限", ""));
    }

    $data=array(
        'patientsData' => getPatientData(getPatient($link,$department_patientID)),
        'therapist' => getTherapist($link,$userNormal,$departmentID),
        'disease' => getDisease($link,$departmentID),
        'treatment' => getTreament($link),
        'merchandise' => getMerchandise($link,$departmentID)
    );
    printJson(1,"",$data);

/* 取得治療師清單
 * 傳入變數：String 使用者帳號,int type,int 分部代號
 * 回傳變數： 
 * 規則：
 *      type=3,治療師，只回傳他自己
 *      其他,回傳該分部代號所有治療師
 */
function getTherapist($link,$user,$departmentID){
    $type = $user["type"];
    $account = $user["account"];        
    $dataq = "SELECT account,name FROM User "
        . "WHERE Department_ID=".$departmentID ." and isTherapist=1 and status=1";
    if($type == 3){
        $dataq = "SELECT account,name FROM User "
        . "WHERE account=".$account ." and isTherapist=1 and status=1";
    }

    $result=mysqli_query($link,$dataq);
    if(!$result || mysqli_num_rows($result)==0){
        return;
    }
    else{
        $therapistData=array();
        while($row=mysqli_fetch_assoc($result)){
            $single = array(
                'account' => $row["account"],
                'name' => $row["name"]
            );
            array_push($therapistData, $single);
        }
        return $therapistData;        
    }
}
/* 取得症狀、價格清單 */
function getDisease($link,$departmentID){
    $dataq = "SELECT a.*,b.TreatmentType_ID,b.price,b.ID as 'bID' FROM Disease as a "
              ."JOIN TreatmentPrice as b ON a.ID = b.Disease_ID "
              ."WHERE a.status=1 and b.status=1 and b.Department_ID=".$departmentID." "
              ."ORDER BY a.part,a.name";
    $result=mysqli_query($link,$dataq);
    if(!$result || mysqli_num_rows($result)==0){
        return;
    }
    else{
        $diseaseData = array();
        $partDisease = array();//單一部位的所有症狀
        $package = array();//單一症狀的不同治療方式價格
        $lastPart = "";//上一筆資料的症狀部位
        $lastName = "";//上一筆資料的症狀名稱
        $lastID = 0;//上一筆的症狀ID
        while($row=mysqli_fetch_assoc($result)){
            //當不同筆症狀時，更新last的資料為目前資料
            if($row["ID"] != $lastID){
                //非第一筆時，輸出到partDisease
                if($lastID >0 ){
                    $singleDisease = array(
                        'ID' => $lastID,
                        'name' => $lastName,
                        'package' => $package
                    );
                    array_push($partDisease, $singleDisease);
                    $package = array();
                }
                $lastID = $row["ID"];
                $lastName = $row["name"];
            }

            //當不同部位時，更新lastPart為目前資料
            if($row["part"] != $lastPart){
                //非第一筆，輸出到diseaseData
                if(strlen($lastPart) > 0){
                    $singlePart = array(
                        'part' => $lastPart,
                        'content' => $partDisease
                    );
                    array_push($diseaseData, $singlePart);
                    $partDisease = array();
                }
                $lastPart = $row["part"];
            }

            //記錄該筆的價格
            $singlePrice = array(
                'ID' => $row["bID"],
                'treatmentType' => $row["TreatmentType_ID"],
                'price' => $row["price"]
            );
            array_push($package, $singlePrice);
        }

        //結清資料
        $singleDisease = array(
            'ID' => $lastID,
            'name' => $lastName,
            'package' => $package
        );
        array_push($partDisease, $singleDisease);
        $singlePart = array(
            'part' => $lastPart,
            'content' => $partDisease
        );
        array_push($diseaseData, $singlePart);

        return $diseaseData;        
    }
}

/* 取得治療項目清單 */
function getTreament($link){
    $dataq = "SELECT a.name as treatmentName,b.* FROM TreatmentType as a "
            ."JOIN Treatment as b ON a.ID=b.TreatmentType_ID "
            ."WHERE a.status=1 and b.status=1 "
            ."ORDER BY b.TreatmentType_ID";
    $result = mysqli_query($link,$dataq);
    if(!$result || mysqli_num_rows($result) == 0){
        return;
    }
    else{
        $treatmentData = array();
        $singleTreatmentType = array();//單一個治療方式下的所有治療項目
        $lastType = 0;//上一筆資料的治療類型
        $lastTypeName = "";//上一筆資料的治療類型名稱
        while($row = mysqli_fetch_assoc($result)){
            //如果治療類型與上一筆不同，更新last資料
            if($row["TreatmentType_ID"] != $lastType){
                //非第一筆，輸出資料到treatmentData
                if($lastType > 0){
                    $singleType = array(
                        'typeID' => $lastType,
                        'typeName' => $lastName,
                        'content' => $singleTreatmentType
                    );
                    array_push($treatmentData, $singleType);
                    $singleTreatmentType = array();
                }
                $lastType = $row["TreatmentType_ID"];
                $lastName = $row["treatmentName"];
            }

            //記錄該筆治療
            $treatment=array(
                'ID' => $row["ID"],
                'name' => $row["name"]
            );
            array_push($singleTreatmentType, $treatment);
        }
        
        //結清
        $singleType = array(
            'typeID' => $lastType,
            'typeName' => $lastName,
            'content' => $singleTreatmentType
        );
        array_push($treatmentData, $singleType);
        return $treatmentData;
    }
}
/* 取得商品清單 */ 
function getMerchandise($link,$departmentID){
    $dataq="SELECT * FROM Merchandise "
            ."WHERE Department_ID=".$departmentID." and status=1 ORDER BY name";
    $result=mysqli_query($link,$dataq);
    if(!$result || mysqli_num_rows($result)==0){
        return;
    }
    else{
        $merchandiseData = array();
        $singleMerchandise = array();//單一商品名稱的資料
        $lastName = "";//上一筆資料的商品名稱
        while($row = mysqli_fetch_assoc($result)){
            //如果商品名稱跟上一筆不同，更新lastName
            if($row["name"] != $lastName){
                //非第一筆，輸出到merchandiseData
                if(strlen($lastName) > 0){
                    $singleName = array(
                        'name' => $lastName,
                        'content' => $singleMerchandise
                    );
                    array_push($merchandiseData, $singleName);
                    $singleMerchandise = array();
                }
                $lastName = $row["name"];
            }

            //紀錄該筆商品
            $merchandise = array(
                'ID' => $row["ID"],
                'size' => $row["size"],
                'remaining' => $row["remaining"],
                'price' => $row["price"]
            );
            array_push($singleMerchandise, $merchandise);
            
        }

        //結清
        $singleName = array(
            'name' => $lastName,
            'content' => $singleMerchandise
        );
        array_push($merchandiseData, $singleName);
        return $merchandiseData;
    }
}  
/* 取得病患的預儲餘額 */
/* TODO 未處理*/
function getCoucher($caseDepartmentID){
    return ;
}

?> 