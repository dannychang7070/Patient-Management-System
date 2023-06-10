<?php
include 'dbc.php';
if (!isset($_POST['startwk'])){
logout();
}
session_start();
if (!isset($_SESSION['user_id']) && !isset($_SESSION['user_email']) && !isset($_SESSION['fae_level'])) 
{
logout();
}else{
	if($_SESSION['fae_level']==0){
		logout();
	}
}
/** Error reporting */
error_reporting(E_ALL);
ini_set('display_errors', TRUE);
ini_set('display_startup_errors', TRUE);
date_default_timezone_set('America/Los_Angeles');

if (PHP_SAPI == 'cli')
	die('This report will only run from a Web Browser');

/** Include PHPExcel */
require_once dirname(__FILE__) . '/Classes/PHPExcel.php';


// Create new PHPExcel object
$objPHPExcel = new PHPExcel();

// Set document properties
$objPHPExcel->getProperties()->setCreator("Francis Lee")
							 ->setLastModifiedBy("Francis Lee")
							 ->setTitle("FAE Status Report")
							 ->setSubject("FAE Status Report")
							 ->setDescription("FAE Status Report generated using PHP classes.")
							 ->setKeywords("FAE Status Report")
							 ->setCategory("FAE Status Report");

               
// Add some data
$objPHPExcel->setActiveSheetIndex(0)
            ->setCellValue('A1', 'Date')
            ->setCellValue('B1', 'Week')
            ->setCellValue('C1', 'Name')
            ->setCellValue('D1', 'Customer')
            ->setCellValue('E1', 'Contact')
            ->setCellValue('F1', 'Reason')
            ->setCellValue('G1', 'Result')
            ->setCellValue('H1', 'Support File');
			//->setCellValue('H1', 'Department')
			//->setCellValue('I1', 'Department Head')	
			

//Query from MSSQL

$dbc = mysqli_connect('10.3.0.61','reseller_mysql','BBc4YKUfavAbnuHe','reseller-drupal6');
mysqli_query($dbc,'SET NAMES "utf8"');
//$sql = "SELECT NULLIF(meeting_date, 0), fullname, customer, contact, reason, results FROM webform_views_fae_weekly_status_update order by fullname ";
$sql ="SELECT NULLIF( v.meeting_date, 0 ) AS DATE, WEEK( v.meeting_date ) +1 AS week, v.fullname, v.customer, v.contact, v.reason, v.results, v.department, (
SELECT d.field_dept_head_name_value
FROM content_type_department AS d
INNER JOIN node AS n ON n.nid = d.nid
WHERE n.title = v.department
) AS dept_head, u.name AS email, v.support_files
FROM webform_views_fae_weekly_status_update AS v
INNER JOIN users AS u ON u.uid = v.uid ";
$sql.= "where week(v.meeting_date)+1 between ".$_POST['startwk']." and ".$_POST['endwk']." ";
if ($_SESSION['fae_level']==2){
	$sql.= "and v.department = '".$_SESSION['dept']."' ";
}
if ($_SESSION['fae_level']==3){
	$sql.= "and u.name in ( '".$_SESSION['user_email']."',";
	if (count($_SESSION['members'])>0){
		$caststring="";
		foreach($_SESSION['members'] as $val){
			$caststring.="'".$val."',";
		}
		$caststring = substr($caststring,0,-1);
		$sql.= $caststring." ";
	}
	$sql.= ") ";
}
$sql.= " and left(v.meeting_date,4)='".$_POST['year']."' order by v.fullname,date ";
$dbq = mysqli_query($dbc,$sql);
$rowcount=2;
$namecount = 0;
$nameholder='';
while ($row = mysqli_fetch_array($dbq,MYSQLI_BOTH)) {
$objPHPExcel->getActiveSheet()->setCellValue('A'.$rowcount, $row[0]);
$objPHPExcel->getActiveSheet()->setCellValue('B'.$rowcount, 'WW'.$row[1]);
$objPHPExcel->getActiveSheet()->setCellValue('C'.$rowcount, $row[2]);
$objPHPExcel->getActiveSheet()->setCellValue('D'.$rowcount, $row[3]);
$objPHPExcel->getActiveSheet()->setCellValue('E'.$rowcount, $row[4]);
$objPHPExcel->getActiveSheet()->setCellValue('F'.$rowcount, $row[5]);
$objPHPExcel->getActiveSheet()->setCellValue('G'.$rowcount, $row[6]);
//This is for support_files field
if($row[10] != ''){
	$sql2 = "SELECT filename, filepath FROM files WHERE fid = '".$row[10]."'";
	$dbq2 = mysqli_query($dbc,$sql2);
	$row2 = mysqli_fetch_array($dbq2);
	//$support_filename = $row2[0];
	$support_filepath = $row2[1];
	// Add a hyperlink to the sheet
	$row[10] = 'View the attachment';
	$objPHPExcel->getActiveSheet()->setCellValue('H'.$rowcount, $row[10]);
	$objPHPExcel->getActiveSheet()->getCell('H'.$rowcount)->getHyperlink()->setUrl('https://mysupermicro.supermicro.com/'.$support_filepath);
}
//$objPHPExcel->getActiveSheet()->setCellValue('H'.$rowcount, $row[10]);
//$objPHPExcel->getActiveSheet()->setCellValue('I'.$rowcount, $row[8]);
if ($nameholder!=$row[2]){
  $nameholder=$row[2];
  $namecount=$namecount+1;
}
$rowcount = $rowcount + 1;
if ($namecount%2==1){
$objPHPExcel->getActiveSheet()->getStyle('A'.($rowcount-1).':C'.($rowcount-1))->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
$objPHPExcel->getActiveSheet()->getStyle('A'.($rowcount-1).':C'.($rowcount-1))->getFill()->getStartColor()->setARGB('FFb8defb');
}else{
$objPHPExcel->getActiveSheet()->getStyle('A'.($rowcount-1).':C'.($rowcount-1))->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
$objPHPExcel->getActiveSheet()->getStyle('A'.($rowcount-1).':C'.($rowcount-1))->getFill()->getStartColor()->setARGB('FFfbfab8');
}
if ($rowcount%2==1){
$objPHPExcel->getActiveSheet()->getStyle('D'.($rowcount-1).':H'.($rowcount-1))->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
$objPHPExcel->getActiveSheet()->getStyle('D'.($rowcount-1).':H'.($rowcount-1))->getFill()->getStartColor()->setARGB('e5f2ff');
}
}
// Set style for header row using alternative method
//$objPHPExcel->getActiveSheet()->getStyle('A2:G2')->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
//$objPHPExcel->getActiveSheet()->getStyle('A2:G2')->getFill()->getStartColor()->setARGB('FF808080');
$styleThinBlackBorderOutline = array(
	'borders' => array(
		'outline' => array(
			'style' => PHPExcel_Style_Border::BORDER_THIN,
			'color' => array('argb' => 'FF000000'),
		),
	),
);
$link_style_array = [
  'font'  => [
    'color' => ['rgb' => '0000FF'],
    'underline' => 'single'
  ]
];
$objPHPExcel->getActiveSheet()->getStyle("H2:H1999")->applyFromArray($link_style_array);
$objPHPExcel->getActiveSheet()->getStyle('A1:H'.($rowcount-1))->applyFromArray($styleThinBlackBorderOutline);
$objPHPExcel->getActiveSheet()->getStyle('A1:H1999')->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_LEFT);
$objPHPExcel->getActiveSheet()->getColumnDimension('A')->setWidth(12);
$objPHPExcel->getActiveSheet()->getColumnDimension('B')->setWidth(8);
$objPHPExcel->getActiveSheet()->getColumnDimension('C')->setWidth(18);
$objPHPExcel->getActiveSheet()->getColumnDimension('D')->setWidth(20);
$objPHPExcel->getActiveSheet()->getColumnDimension('E')->setWidth(18);
$objPHPExcel->getActiveSheet()->getColumnDimension('F')->setWidth(50);
$objPHPExcel->getActiveSheet()->getColumnDimension('G')->setWidth(50);
$objPHPExcel->getActiveSheet()->getColumnDimension('H')->setWidth(20);
//$objPHPExcel->getActiveSheet()->getColumnDimension('I')->setWidth(18);
$objPHPExcel->getActiveSheet()->getStyle('F2:F1999')->getAlignment()->setWrapText(true);
$objPHPExcel->getActiveSheet()->getStyle('G2:G1999')->getAlignment()->setWrapText(true);
$objPHPExcel->getActiveSheet()->getStyle('E2:E1999')->getAlignment()->setWrapText(true);
$objPHPExcel->getActiveSheet()->getStyle('A1:H1')->applyFromArray(
		array(
			'font'    => array(
				'bold'      => true
			),
			'alignment' => array(
				'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_CENTER,
			),
			'borders' => array(
				'top'     => array(
 					'style' => PHPExcel_Style_Border::BORDER_THIN
 				)
			),
			'fill' => array(
	 			'type'       => PHPExcel_Style_Fill::FILL_GRADIENT_LINEAR,
	  			'rotation'   => 90,
	 			'startcolor' => array(
	 				'argb' => 'FFA0A0A0'
	 			),
	 			'endcolor'   => array(
	 				'argb' => 'FFFFFFFF'
	 			)
	 		)
		)
);



// Rename worksheet
$objPHPExcel->getActiveSheet()->setTitle('FAE Status Report');


// Set active sheet index to the first sheet, so Excel opens this as the first sheet
$objPHPExcel->setActiveSheetIndex(0);


// Redirect output to a client’s web browser (Excel2007)
header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
header('Content-Disposition: attachment;filename="FAE_Report.xlsx"');
header('Cache-Control: max-age=0');
// If you're serving to IE 9, then the following may be needed
header('Cache-Control: max-age=1');

// If you're serving to IE over SSL, then the following may be needed
header ('Expires: Mon, 26 Jul 1997 05:00:00 GMT'); // Date in the past
header ('Last-Modified: '.gmdate('D, d M Y H:i:s').' GMT'); // always modified
header ('Cache-Control: cache, must-revalidate'); // HTTP/1.1
header ('Pragma: public'); // HTTP/1.0

$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
$objWriter->save('php://output');
exit;
?>