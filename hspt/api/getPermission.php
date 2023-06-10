<?php
	/*
     * API=6.0 取得權限 getPermission.php
     * 2019-06-23 v2 權限更新
    */

    //{"account":"admin"}

    /* 初始化：取得共用函式庫、取得輸入資料、資料庫連線 */
    include('shareFunction.php');
    $data = getJsonInput();  
    $link = initDB();

    /* 執行功能 */
    $token = $data -> token;
    $codeAdmin = "06-1-修改使用者權限";
    $userAdmin = getAccount($link,$token,$codeAdmin);
    if($userAdmin == null){
        die(printJson(0, "無 $codeAdmin 權限", ""));
    }
    printJson(1,"",getPermission($link));

/* 取得權限資料 */
function getPermission($link){
	//資料列表初始化
	$permissionArray = array();
	$title = array(
		'ID' => "序號",
		'name' => "角色名稱",
		'p01' => "權限01",
		'p02' => "權限02",
		'p03' => "權限03",
		'p04' => "權限04",
		'p05' => "權限05",
		'p06' => "權限06",
		'p07' => "權限07",
		'p08' => "權限08",
		'p09' => "權限09",
		'p10' => "權限10",
		'p11' => "權限11",
		'p12' => "權限12",
		'p13' => "權限13",
		'p14' => "權限14",
		'p15' => "權限15",
		'p16' => "權限16",
		'p17' => "權限17",
		'p18' => "權限18",
		'p19' => "權限19",
		'p20' => "權限20",
		'p21' => "權限21",
		'p22' => "權限22"
	);
	array_push($permissionArray , $title);

	//查詢權限
    $permissionSql = "SELECT * FROM Permission WHERE status = 1 ORDER BY ID";
    $result = mysqli_query($link,$permissionSql);
    
    while($row=mysqli_fetch_assoc($result)){
        $single = array(
            'ID' => $row["ID"],
			'name' => $row["name"],
			'p01' => $row["p01"],
			'p02' => $row["p02"],
			'p03' => $row["p03"],
			'p04' => $row["p04"],
			'p05' => $row["p05"],
			'p06' => $row["p06"],
			'p07' => $row["p07"],
			'p08' => $row["p08"],
			'p09' => $row["p09"],
			'p10' => $row["p10"],
			'p11' => $row["p11"],
			'p12' => $row["p12"],
			'p13' => $row["p13"],
			'p14' => $row["p14"],
			'p15' => $row["p15"],
			'p16' => $row["p16"],
			'p17' => $row["p17"],
			'p18' => $row["p18"],
			'p19' => $row["p19"],
			'p20' => $row["p20"],
			'p21' => $row["p21"],
			'p22' => $row["p22"]
        );
        array_push($permissionArray , $single);
    }
    return $permissionArray;
}
?>