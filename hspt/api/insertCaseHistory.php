<?php
    /*
     * API=1.0 新增病歷 insertCaseHistroy
     * 2017-04-02 v1 By陳志鴻 新增診療輯錄、商品購買紀錄未處理
     * 2017-04-05 v1 By陳志鴻 完成
     * 2017-07-02 v2 新增共用函式庫
     * 2017-07-04 BUG 沒有更新商品主表剩餘數量
     * 2018-06-06 支援商品先進先出功能
     * 2018-06-06 預售病歷商品沒有對應到商品存貨，當進貨時，才自動關聯到商品存貨
        (insertInventory處理，目前未處理)
     */

    /* 商品先進先出處理邏輯 
     * 1.批次更新商品剩餘數量，update Merchandise 商品總表 MerchandiseRecord 商品庫存表
     * 2.批次新增病歷商品並取得起始ID，insert CaseMerchandise 病歷商品
     * 3.批次新增病歷商品與庫存關聯表，insert CaseMerchandiseRecord
     */
	
    /* 初始化：取得共用函式庫、取得輸入資料、資料庫連線 */
    include('shareFunction.php');
    $data = getJsonInput();  
    $link = initDB();
    
    /* 執行功能 */
    $token = $data -> token;
    $departmentID = $data -> departmentID;
    $therapistAccount = $data -> therapistAccount;

    $codeAdmin = "01-2-新增跨區治療師病歷";
    $userAdmin = getAccount($link,$token,$codeAdmin);
    
    $codeLocal = "01-2-新增單位治療師病歷";
    $userLocal = getAccount($link,$token,$codeLocal);

    $codeNormal = "00-0-預設權限";
    $userNormal = getAccount($link,$token,$codeNormal);
    $account = $userNormal["account"];
    
    if($userAdmin == null && $departmentID != $userNormal["Department_ID"]){
        die(printJson(0, "無 $codeAdmin 權限", ""));
    }
    if($userLocal == null && $therapistAccount != $userNormal["account"]){
        die(printJson(0, "無 $userLocal 權限", ""));
    }

    if(checkData($data,$link)){
        //新增病歷主表
        $caseHistoryID=addCaseHistroy($data,$link,$account);
        if($caseHistoryID>0){
            $caseTreatment = $data -> caseTreatment;
            $caseMerchandise = $data -> caseMerchandise;
            //新增病歷診療明細
            if(COUNT($caseTreatment)>0 && !addCaseTreatment($caseTreatment,$link,$caseHistoryID,$account)){
                deleteCaseHistroy($link,$caseHistoryID,"新增治療方式發生錯誤");
            }
            //新增病歷商品明細
            if(COUNT($caseMerchandise)> 0){
                //先扣商品主表
                if(!updateMerchandise($link,$caseMerchandise)){
                    deleteCaseHistroy($link,$caseHistoryID,"更新商品數量發生錯誤1");
                }
                //再扣商品庫存表
                $splitMerchandise = splitMerchandise($link,$caseMerchandise);
                if(!updateMerchandiseRecord($link,$splitMerchandise)){
                    deleteCaseHistroy($link,$caseHistoryID,"更新商品數量發生錯誤2");
                }
                //新增病歷商品
                $startID = insertCaseMerchandise($link,$caseMerchandise,$caseHistoryID,$account);
                if(!$startID > 0 || !insertCaseMerchandiseRecord($link,$caseMerchandise,$splitMerchandise,$startID,$account)){
                    deleteCaseHistroy($link,$caseHistoryID,"新增病歷商品發生錯誤");
                }
            }
            
            
            //完成所有流程
            printJson(1,"","");
        }
        else{
            printJson(0,"無法新增病歷","");
        }
    }
    
// 檢查資料正確性    
function checkData($data,$link){
    $patientID = $data -> department_patientID;
    $dateString = $data -> dateString;
    $therapistAccount = $data -> therapistAccount;
    $departmentID = $data -> departmentID;
                
    //判斷是否有該病患、治療師
    $data1 = "SELECT * FROM CaseDepartment WHERE ID = $patientID";
    $result = mysqli_query($link,$data1);
    if(!$result || mysqli_num_rows($result) == 0){
        die(printJson(0,"查無此病患",""));
	}
    $data2 = "SELECT * 
        FROM User 
        WHERE account='$therapistAccount' AND Department_ID = $departmentID AND isTherapist = 1 AND status = 1";
    $result = mysqli_query($link,$data2);
    if(!$result || mysqli_num_rows($result) == 0){
        die(printJson(0,"查無此治療師，或該治療師目前無法看診",""));
	}
        
    //判斷該病例是否已新增過（用病患編號與就診時間）
    $dataq = "SELECT * 
        FROM CaseHistory 
        WHERE CaseDepartment_ID = $patientID AND time = '$dateString' AND User_account2 = '$therapistAccount'";
	$result = mysqli_query($link,$dataq);
	if(!$result || mysqli_num_rows($result) == 0){
        return true;
	}
    else {
        die(printJson(0,"今日已新增過病例",""));
    }
}

//新增病患該時間點的病歷，如果成功回傳新增的ID
function addCaseHistroy($data,$link,$account){
    $therapistAccount = $data -> therapistAccount;
    $patientID = $data -> department_patientID;
    $dateString = $data -> dateString;
    $note = $data -> note;
    $data1 = "INSERT INTO CaseHistory (
            CaseDepartment_ID,
            User_account1,
            User_account2,
            time,
            note
        ) 
        VALUES ($patientID,'$account','$therapistAccount','$dateString','$note')";
    if ($link->query($data1) === TRUE) {
        return $link->insert_id;
    } else {
        return -1;
    }
}
    
//如果診療紀錄或診療商品新增失敗，刪除該時間點
function deleteCaseHistroy($link,$caseHistoryID,$msg){
    $data1 = "DELETE FROM CaseHistory WHERE ID = ".$caseHistoryID;
    if ($link->query($data1) === TRUE) {
        die(printJson(0, $msg, ""));
    }
    die(printJson(0, "系統發生嚴重錯誤", ""));
}

//新增該病歷的診療紀錄
function addCaseTreatment($data,$link,$caseHistoryID,$user){
    $combin = array();
    foreach ($data as $disease){
        $diseaseID = $disease -> diseaseID;
        $TreatmentPrice_ID = $disease -> packetageID;//症狀治療包裝價格ID
        $price = $disease -> price;
        $charge = $disease -> charge;

        $treatmentIDs = array();
        foreach($disease -> treatment as $treatment){
            array_push($treatmentIDs, $treatment -> ID);
        }
        $tIDs = implode( ",", $treatmentIDs);

        array_push($combin, "($caseHistoryID,$diseaseID,$TreatmentPrice_ID,$tIDs,$price,$charge,'$user',0)");
    }
    if(COUNT($combin) > 0){
        $values = implode( ",", $combin);
        $sql = "INSERT INTO CaseTreatment (
                CaseHistory_ID,
                Disease_ID,
                TreatmentPrice_ID,
                Treatment_ID,
                price,
                charge,
                User_account1,
                isDelete
            ) 
            VALUES $values";
        if($link->query($sql) === TRUE) return true;
    }
    return false;
}

//查詢商品庫存表，回傳商品庫存表array
function getInventory($caseMerchandise,$link){
    $match = array();
    $inventory = array();
    //組合要查詢的商品ID
    foreach ($caseMerchandise as $single) {
        array_push($match, $single -> merchandiseID);
        $inventory[$single -> merchandiseID] = array();
    }
    $sql = "SELECT * FROM MerchandiseRecord WHERE remaining>0 AND status =1 AND type = 1 AND Merchandise_ID IN ('" . implode("','", $match) . "')";
    $result=mysqli_query($link,$sql);

    //組合回傳的商品庫存表(key=商品ID,value=商品庫存array)
    if($result && mysqli_num_rows($result) == 0){
        return $inventory;
    }
    while($row = mysqli_fetch_assoc($result)){
        array_push($inventory[$row["Merchandise_ID"]],$row);
    }
    return $inventory;
}

//扣商品剩餘數量，回傳是否成功
function updateMerchandise($link,$merchandise){
    $combin = "";
    foreach($merchandise as $item){
        $merchandiseID = $item -> merchandiseID; 
        $amount = $item -> amount;
        $combin .= "(" . $merchandiseID . "," . $amount . "),";
    }

    if(strlen($combin)>0){
        $sql = "INSERT INTO Merchandise (`ID`,`remaining`) VALUES ".substr($combin,0,-1)." ON DUPLICATE KEY UPDATE remaining = remaining - VALUES(remaining)";
     
        if($link->query($sql) === TRUE) return true;
    }
    return false;

    /*更新商品數量，因為有綁定外來鍵，如果要insert時會被擋下來回傳錯誤(故原本的update用此語法替代)
        INSERT INTO Merchandise (`ID`,`remaining`) VALUES (1,5),(3,5),(4,5)
        ON DUPLICATE KEY UPDATE remaining = remaining - VALUES(remaining)
    */
}

//病歷商品對應商品庫存紀錄拆單，回傳拆單array
function splitMerchandise($link,$merchandise){
    $inventoryList = getInventory($merchandise,$link);
    $splitList = array();
    //歷遍新增的病歷商品
    foreach ($merchandise as $item){
        $merchandiseID = $item -> merchandiseID; 
        $tempAmount = $item -> amount;//未對應到庫存批號的商品數量
        $splitList[$merchandiseID] = array();

        //有對應到庫存批號的病歷商品
        foreach($inventoryList[$merchandiseID] as $inventory){
            //該庫存足夠使用，扣完並跳出迴圈
            if($tempAmount > 0 && $inventory["remaining"] >= $tempAmount){
                $single = array(
                    'MerchandiseRecord_ID' => $inventory["ID"],
                    'amount' => $tempAmount
                );
                $tempAmount = 0;
                array_push($splitList[$merchandiseID],$single);
                break;
            }
            //該庫存不夠使用，扣完不跳出迴圈
            if($tempAmount > 0){
                $single = array(
                    'MerchandiseRecord_ID' => $inventory["ID"],
                    'amount' => $inventory["remaining"]
                );
                $tempAmount -= $inventory["remaining"];
                array_push($splitList[$merchandiseID],$single);
            }
        }
        //沒有對應到庫存批號的病歷商品
        if($tempAmount > 0){
            $single = array(
                'MerchandiseRecord_ID' => 0,
                'amount' => $tempAmount
            );
            array_push($splitList[$merchandiseID],$single);
        }
    }
    return $splitList;
}

//更新商品進貨紀錄，回傳是否成功
function updateMerchandiseRecord($link,$splitList){
    $combin = "";
    foreach($splitList as $merchandise){
        foreach ($merchandise as $item) {
            if($item["MerchandiseRecord_ID"] != null){
                $combin .= "(" . $item["MerchandiseRecord_ID"] . "," . $item["amount"] . "),";
            }
        }
    }

    if(strlen($combin)>0){
        $sql = "INSERT INTO MerchandiseRecord (`ID`,`remaining`) VALUES ".substr($combin,0,-1)." ON DUPLICATE KEY UPDATE remaining = remaining - VALUES(remaining)";
        if($link->query($sql) === TRUE) return true;
        else return false;
    }
    return true;//沒有要更新的項目
}

//新增病歷商品，回傳ID
function insertCaseMerchandise($link,$merchandise,$caseHistoryID,$user){
    $combin = "";
    foreach($merchandise as $item){
        $merchandiseID = $item -> merchandiseID; 
        $amount = $item -> amount;
        $price = $item -> price;
        $charge = $item -> charge;
        $combin .= "(".$caseHistoryID.",".$merchandiseID.",".$amount.",".$price.",".$charge.",'".$user."',0),";
    }
    if(strlen($combin)>0){
        $sql = "INSERT INTO CaseMerchandise ( CaseHistory_ID, Merchandise_ID, amount, price, charge, User_account1, isDelete) VALUES ".substr($combin,0,-1);
        if($link->query($sql) === TRUE){
            //回傳本次新增病例商品的起始ID
            return $link->insert_id;
        }
    }
    return 0;
}

//新增病歷商品(startID=第一筆病歷商品對應的ID)，回傳是否成功
function insertCaseMerchandiseRecord($link,$merchandise,$splitList,$startID,$user){
    $combin = "";
    foreach ($merchandise as $single) {
        $merchandiseID = $single -> merchandiseID; 
        foreach($splitList[$merchandiseID] as $item){
            $amount = $item -> amount;
            $price = $item -> price;
            $charge = $item -> charge;
            $combin .= "(".$startID.",".$item["MerchandiseRecord_ID"].",".$item["amount"].",'".$user."',0),";
        }
        $startID++;
    }
    
    if(strlen($combin)>0){
        $sql = "INSERT INTO CaseMerchandiseRecord ( CaseMerchandise_ID, MerchandiseRecord_ID, amount, User_account1, isDelete) VALUES ".substr($combin,0,-1);
        if($link->query($sql) === TRUE) return true;
    }
    return false;
}
?>