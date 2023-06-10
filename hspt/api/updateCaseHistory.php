<?php
// 因應病歷不可改，移除該API
// 刪除病歷跑退貨，可以參考該檔案

    /*
     * API=2.0 更新病歷資料 updateCaseHistory
     * 2017-07-02 v1 新增共用函式庫
     * 2018-06-23 v2 所有邏輯、程式翻新(全面使用批次SQL語法)
    */

    /* 商品異動邏輯
     * 1.判斷是否有異動
     * 2.商品全退貨再重新新增
     */

    /* TODO 
     * 1.old資料檢查與DB是否一致
     * 2.使用權限異動
     */

    /* 初始化：取得共用函式庫、取得輸入資料、資料庫連線 */
    include('shareFunction.php');
    $data = getJsonInput();  
    $link=initDB();
    
    /* 執行功能 */
    $user = getAccountByDepartmentID($link,$data -> account,$data -> departmentID);
    if(checkData($link,$data,$user)){
        $caseHistoryID = $data -> caseHistory_ID;
        $account = $data -> account;
        //更新病歷
        updateCaseTreatment($link,$data -> newCaseTreatment,$caseHistoryID,$account);

        //刪除商品、新增商品
        $oldJson = $data -> oldCaseMerchandise;
        $newJson = $data -> newCaseMerchandise;
        if(COUNT($newJson)>0 && needUpdateMerchandise($oldJson,$newJson)){
            deleteMerchandiseRecord($link,$oldJson);
            //先扣商品主表
            if(!updateMerchandise($link,$newJson)){
                die(printJson(0, "更新商品數量發生錯誤", ""));
            }
            //再扣商品庫存表
            $splitMerchandise = splitMerchandise($link,$newJson);
            if(!updateMerchandiseRecord($link,$splitMerchandise)){
                die(printJson(0, "更新商品數量發生錯誤", ""));
            }
            //新增病歷商品
            $startID = insertCaseMerchandise($link,$newJson,$caseHistoryID,$account);
            if(!$startID > 0 || !insertCaseMerchandiseRecord($link,$newJson,$splitMerchandise,$startID,$account)){
                die(printJson(0, "新增病歷商品發生錯誤", ""));
            }
        }
        printJson(1, "", "");
    }
    
    
//驗證傳入資料是否正確
function checkData($link,$data,$user){
    $date = $data -> date;
    $caseHistory_ID = $data -> caseHistory_ID;
    $departmentID = $data -> departmentID;
    //檢查使用者帳號與分部ID是否正確
    if($user == null){
        die(printJson(0, "查無此帳號", ""));
    }

    //檢查病歷ID的病患所屬分部ID是否與傳入的分部相同
    $dataq2 = "SELECT a.ID FROM CaseHistory as a JOIN CaseDepartment as b ON a.CaseDepartment_ID = b.ID "
             ."WHERE a.ID=".$caseHistory_ID." and a.time='".$date."' and b.Department_ID=".$departmentID;
    $result2 = mysqli_query($link,$dataq2);
    if(!$result2 || mysqli_num_rows($result2)==0){
        die(printJson(0, "病患資料錯誤", ""));
    }
 
    return true;
}

//取得要更新的資料(作廢)
function needUpdateData($link,$data,$type){
    $oldCaseTreatment = $data -> oldCaseTreatment;
    $newCaseTreatment = $data -> newCaseTreatment;
    $caseHistory_ID = $data -> caseHistory_ID;
    $updateTreatment = array();//要更新的病歷診療集合

    //資料加入字典集，key=ID,value=object
    $oct = array();
    foreach ($oldCaseTreatment as $singleTreatment) {
        $oct[$singleTreatment -> ID] = $singleTreatment;
    }
    $nct = array();
    foreach ($newCaseTreatment as $singleTreatment) {
        $nct[$singleTreatment -> ID] = $singleTreatment;
    }

    //取出DB舊資料
    $sqlStnig1 = "SELECT * FROM CaseTreatment WHERE CaseHistory_ID =".$caseHistory_ID;
    $result1 = mysqli_query($link,$sqlStnig1);
    if(!$result1 || mysqli_num_rows($result1)==0){
        die(printJson(0, "病歷資料錯誤1", ""));
    }
    $sqlString2 = "SELECT * FROM CaseMerchandise WHERE CaseHistory_ID = ".$caseHistory_ID;
    $result2 = mysqli_query($link,$sqlString2);
    if(!$result2 || mysqli_num_rows($result2)==0){
        die(printJson(0, "病歷資料錯誤2", ""));
    }

    //DB資料與oct比對是否正確，正確且nct與oct不同，加入updateTreatment
    while($row=mysqli_fetch_assoc($result1)){
        if(array_key_exists($row["ID"],$oct)){
            $singleOCT = $oct[$row["ID"]];
            $diseaseID = $singleOCT -> diseaseID;
            $part = $singleOCT -> part;
            $diseaseName = $singleOCT -> diseaseName;
            $treatmentID = $singleOCT -> treatmentID;
            $treatmentName = $singleOCT -> treatmentName;
            $treatmentType = $singleOCT -> treatmentType;
            $charge = $singleOCT -> charge;
            //oct資料與DB是否相同
            if($diseaseID == $row["Disease_ID"] && $part == $row["diseasePart"] && $diseaseName == $row["diseaseName"] && $treatmentID == $row["Treatment_ID"] && $treatmentName == $row["treatmentName"] && $treatmentType == $row["treatmentType"] && $charge == $row["charge"]){
                //oct資料與nct是否相同
                if(array_key_exists($row["ID"], $nct)){
                    $singleNCT = $nct[$row["ID"]];
                    $new_diseaseID = $singleNCT -> diseaseID;
                    $new_part = $singleNCT -> part;
                    $new_diseaseName = $singleNCT -> diseaseName;
                    $new_treatmentID = $singleNCT -> treatmentID;
                    $new_treatmentName = $singleNCT -> treatmentName;
                    $new_treatmentType = $singleNCT -> treatmentType;
                    $new_charge = $singleNCT -> charge;
                    $new_isDelete = $singleNCT -> isdelete == 1 ? 1 : 0;
                    if($diseaseID != $new_diseaseID || $part != $new_part || $diseaseName != $new_diseaseName || $treatmentID != $new_treatmentID || $treatmentName != $new_treatmentName || $treatmentType != $new_treatmentType || $charge != $new_charge || $new_isDelete == 1 ){
                        array_push($updateTreatment, $singleNCT);
                    }
                }

            }
            else{
                die(printJson(0, "病歷資料錯誤(有假資料1)", ""));
            }
        }
    }
    //DB資料與ocm比對是否正確，正確且ncm與ocm不同，加入updateMerchandise
    while($row=mysqli_fetch_assoc($result2)){
        if(array_key_exists($row["ID"],$ocm)){
            $singleOCM = $ocm[$row["ID"]];
            $merchandiseID = $singleOCM -> merchandiseID;
            $name = $singleOCM -> name;
            $size = $singleOCM -> size;
            $amount = $singleOCM -> amount;
            $charge = $singleOCM -> charge;
            //ocm資料與DB是否相同
            if($merchandiseID == $row["Merchandise_ID"] && $name == $row["merchandiseName"] && $size == $row["merchandiseSize"] && $amount == $row["amount"] && $charge == $row["charge"]){
                //ocm資料與ncm是否相同
                $singleNCM = $ncm[$row["ID"]];
                $new_merchandiseID = $singleNCM -> merchandiseID;
                $new_name = $singleNCM -> name;
                $new_size = $singleNCM -> size;
                $new_amount = $singleNCM -> amount;
                $new_price = $singleNCM -> price;
                $new_charge = $singleNCM -> charge;
                $new_isDelete = $singleNCM -> isdelete == 1 ? 1 : 0;
                if($merchandiseID != $new_merchandiseID || $name != $new_name || $size != $new_size || $amount != $new_amount || $charge != $new_charge || $new_isDelete == 1){
                    $temp = array(
                        'ID' => $row["ID"],
                        'merchandiseID' => $new_merchandiseID,
                        'name' => $new_name,
                        'size' => $new_size,
                        'newAmount' => $new_amount,
                        'oldAmount' => $amount,
                        'price' => $new_price,
                        'charge' => $new_charge,
                        'isDelete' => $new_isDelete
                    );
                    array_push($updateMerchandise, $temp);
                    //判斷商品剩餘數量是否要異動
                    if($merchandiseID != $new_merchandiseID){
                        $updateoldM = array('ID' => $merchandiseID, 'change' => 0 - $amount);
                        $updateNewM = array('ID' => $merchandiseID, 'change' => $new_amount);
                        array_push($updateMerchandiseAmount, $updateoldM);
                        array_push($updateMerchandiseAmount, $updateNewM);
                    }
                    else if($amount != $new_amount){
                        $updateoldM = array('ID' => $merchandiseID, 'change' => $new_amount - $amount);
                        array_push($updateMerchandiseAmount, $updateoldM);
                    }
                }
            }
            else{
                die(printJson(0, "病歷資料錯誤(有假資料2)", ""));
            }
        }
    }
    $needUpdateArray = array(
        'caseTreatmet' => $updateTreatment,
        'caseMerchandise' => $updateMerchandise,
        'merchandiseAmount' => $updateMerchandiseAmount
    );
    return $needUpdateArray;
}    
//更新病歷診療
function updateCaseTreatment($link,$newJson,$caseID,$account){
    if($newJson != null && COUNT($newJson)>0){
        //取得目MAX(ID)
        $result=mysqli_query($link,"SELECT MAX(id) FROM CaseTreatment");
        $max = mysqli_fetch_assoc($result)["MAX(id)"];
        //組合新增、更新內容
        $combin = "";
        foreach($newJson as $i){
            foreach ($i -> treatment as $t) {
                $ID = $t -> ID > 0 ? $t -> ID : ++$max; 
                $combin .= "(" ;
                $combin .= $ID . "," . $caseID . "," . $i -> diseaseID . ",";
                $combin .= $i -> packetageID . "," . $t -> treatmentID . ",";
                $combin .= $i -> price . "," . $i -> charge . ",";
                $combin .= $t -> isDelete . ",'" . $account . "'),";    
            }
        }

        //執行SQL
        $sql = "INSERT INTO CaseTreatment (`ID`,`CaseHistory_ID`,`Disease_ID`,`TreatmentPrice_ID`,`Treatment_ID`,`price`,`charge`,`isDelete`,`User_account1`) VALUES ".substr($combin,0,-1)." ON DUPLICATE KEY UPDATE CaseHistory_ID = VALUES(CaseHistory_ID), Disease_ID = VALUES(Disease_ID),TreatmentPrice_ID = VALUES(TreatmentPrice_ID),Treatment_ID = VALUES(Treatment_ID),price = VALUES(price),charge = VALUES(charge),isDelete = VALUES(isDelete),User_account2 = VALUES(User_account1),updateTime = NOW()";
 
        if(strlen($combin) > 0 && $link->query($sql) === false){
            die(printJson(0, "病歷更新失敗", ""));
        } 
    }
}

/* 比對商品是否有異動 */
function needUpdateMerchandise($oldJson,$newJson){
    //新舊數量不一緻，回傳true
    if(COUNT($oldJson) != COUNT($newJson)) return true;
    //新資料夾入hash進行資料比對
    $newHash = array();
    foreach ($newJson as $item) {
        $newHash[$item -> ID] = $item;
        //如果有刪除，回傳true
        if($item -> isDelete == 1) return true;
    }
    //比對新舊資料的「量、實收價」
    foreach ($oldJson as $item){
        $new = $newHash[$item -> ID];
        if($new -> amount != $item -> amount) return true;
        else if($new -> charge != $item -> charge) return true;
    }
    return false;
}

/* 商品跑退貨流程 */
function deleteMerchandiseRecord($link,$oldJson){
    //取得需要退貨的 MerchandiseRecord ID
    $caseMerchandiseIDs = array();
    $mCombin = "";
    foreach($oldJson as $item){
        array_push($caseMerchandiseIDs, $item -> ID);
        $mCombin .= "(" . $item -> merchandiseID . "," . $item -> amount . "),";
    }
    $sql = "SELECT * FROM CaseMerchandiseRecord WHERE CaseMerchandise_ID IN ('" . implode("','", $caseMerchandiseIDs) . "')";
    $result=mysqli_query($link,$sql);

    //退貨到 MerchandiseRecord
    $combin = "";
    while($row = mysqli_fetch_assoc($result)){
        //如果為預售商品，沒有對應到進貨紀錄，故不需要update
        if($row["MerchandiseRecord_ID"] > 0){
            $combin .= "(" . $row["MerchandiseRecord_ID"] . "," . $row["amount"] . "),";
        }
    }
    $sql = "INSERT INTO MerchandiseRecord (`ID`,`remaining`) VALUES ".substr($combin,0,-1)." ON DUPLICATE KEY UPDATE remaining = remaining + VALUES(remaining)";
    if(strlen($combin) > 0 && $link->query($sql) === false){
        die(printJson(0, "商品退貨失敗1", ""));
    } 

    //刪除 病歷商品紀錄
    $sql = "DELETE FROM CaseMerchandiseRecord WHERE CaseMerchandise_ID IN ('" . implode("','", $caseMerchandiseIDs) . "')";
    if(strlen($combin) > 0 && $link->query($sql) === false){

        die(printJson(0, "商品退貨失敗2", ""));
    } 
    $sql = "DELETE FROM CaseMerchandise WHERE ID IN ('" . implode("','", $caseMerchandiseIDs) . "')";
    if(strlen($combin) > 0 && $link->query($sql) === false){
 
        die(printJson(0, "商品退貨失敗3", ""));
    } 

    //退貨到 Merchandise
    $sql = "INSERT INTO Merchandise (`ID`,`remaining`) VALUES ".substr($combin,0,-1)." ON DUPLICATE KEY UPDATE remaining = remaining + VALUES(remaining)";
    if(strlen($combin) > 0 && $link->query($sql) === false){
        die(printJson(0, "商品退貨失敗4", ""));
    } 
}

//查詢商品庫存表，回傳商品庫存表array
function getInventory($caseMerchandise,$link){
    $match = array();
    $inventory = array();
    //組合要查詢的商品ID
    foreach ($caseMerchandise as $single) {
        if($single -> isDelete == 0){
            array_push($match, $single -> merchandiseID);
            $inventory[$single -> merchandiseID] = array();
        } 
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
        if($item -> isDelete == 0){
           $merchandiseID = $item -> merchandiseID; 
            $amount = $item -> amount;
            $combin .= "(" . $merchandiseID . "," . $amount . "),";
        }
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
        if($item -> isDelete == 0){
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
        if($item -> isDelete == 0){
            $merchandiseID = $item -> merchandiseID; 
            $amount = $item -> amount;
            $price = $item -> price;
            $charge = $item -> charge;
            $combin .= "(".$caseHistoryID.",".$merchandiseID.",".$amount.",".$price.",".$charge.",'".$user."',0),";
        }
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
        if($single -> isDelete == 0){
            foreach($splitList[$merchandiseID] as $item){
                $amount = $item -> amount;
                $price = $item -> price;
                $charge = $item -> charge;
                $combin .= "(".$startID.",".$item["MerchandiseRecord_ID"].",".$item["amount"].",'".$user."',0),";
            }
            $startID++;
        }
    }
    
    if(strlen($combin)>0){
        $sql = "INSERT INTO CaseMerchandiseRecord ( CaseMerchandise_ID, MerchandiseRecord_ID, amount, User_account1, isDelete) VALUES ".substr($combin,0,-1);
        if($link->query($sql) === TRUE) return true;
    }
    return false;
}
?> 