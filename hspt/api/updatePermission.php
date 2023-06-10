<?php
	/*
     * API=6.0 更新權限 updatePermission.php
    */

	//{"account":"admin","permission":[{"ID":0,"name":"會計人員","p01":0,"p02":0,"p03":1,"p04":1,"p05":1,"p06":1,"p07":1,"p08":1,"p09":1,"p10":1,"p11":1,"p12":1,"p13":1,"p14":1,"p15":1,"p16":1,"p17":1,"p18":1,"p19":1,"p20":1,"p21":1,"p22":1}]}
	
    /* 初始化：取得共用函式庫、取得輸入資料、資料庫連線 */
    include('shareFunction.php');
    $data = getJsonInput();  
    $link = initDB();

/* 執行功能 */
    $token = $data -> token;
    $permission = $data -> permission;

    $codeAdmin = "06-1-修改使用者權限";
    $userAdmin = getAccount($link,$token,$codeAdmin);
    if($userAdmin == null){
        die(printJson(0, "無 $codeAdmin 權限", ""));
    }

    if(updatePermission($link,$permission)){
        printJson(1,"","");
    }
    else{
        printJson(0,"更新失敗","");
    }

/* 更新資料 */
function updatePermission($link,$permission){
	$combin = "";
	foreach($permission as $item){
		$ID = $item -> ID;
		$name = $item -> name;
        $p01 = $item -> p01;
        $p02 = $item -> p02;
        $p03 = $item -> p03;
        $p04 = $item -> p04;
        $p05 = $item -> p05;
        $p06 = $item -> p06;
        $p07 = $item -> p07;
        $p08 = $item -> p08;
        $p09 = $item -> p09;
        $p10 = $item -> p10;
		$p11 = $item -> p11;
		$p12 = $item -> p12;
		$p13 = $item -> p13;
		$p14 = $item -> p14;
		$p15 = $item -> p15;
		$p16 = $item -> p16;
		$p17 = $item -> p17;
		$p18 = $item -> p18;
		$p19 = $item -> p19;
		$p20 = $item -> p20;
		$p21 = $item -> p21;
		$p22 = $item -> p22;
		$status = 1;//預設啟用
        $combin .= "(".$ID.",'".$name."',".$p01.",".$p02.",".$p03.",".$p04.",".$p05.",".$p06.",".$p07.",".$p08.",".$p09.",".$p10.",".$p11.",".$p12.",".$p13.",".$p14.",".$p15.",".$p16.",".$p17.",".$p18.",".$p19.",".$p20.",".$p21.",".$p22.",".$status."),";
    }
    /* ON DUPLICATE KEY UPDATE 當pk重複時update，否則走insert */
    if(strlen($combin)>0){
        $sql = "INSERT INTO Permission (`ID`,`name`,`p01`,`p02`,`p03`,`p04`,`p05`,`p06`,`p07`,`p08`,`p09`,`p10`,`p11`,`p12`,`p13`,`p14`,`p15`,`p16`,`p17`,`p18`,`p19`,`p20`,`p21`,`p22`,`status`) VALUES ".substr($combin,0,-1)." ON DUPLICATE KEY UPDATE name = VALUES(name), p01 = VALUES(p01), p02 = VALUES(p02), p03 = VALUES(p03), p04 = VALUES(p04), p05 = VALUES(p05), p06 = VALUES(p06), p07 = VALUES(p07), p08 = VALUES(p08), p09 = VALUES(p09), p10 = VALUES(p10), p11 = VALUES(p11), p12 = VALUES(p12), p13 = VALUES(p13), p14 = VALUES(p14), p15 = VALUES(p15), p16 = VALUES(p16), p17 = VALUES(p17), p18 = VALUES(p18), p19 = VALUES(p19), p20 = VALUES(p20), p21 = VALUES(p21), p22 = VALUES(p22)";

        if($link->query($sql) === TRUE) return true;
    }
}
?>