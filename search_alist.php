<?php
session_start();
header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
header("cache-Control: no-store, no-cache, must-revalidate");
header("cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

$keyword = $_POST[keyword];
$type_keyword = $_POST[type_keyword];
$page_select = ($_GET[page_select] ? $_GET[page_select] : 1);

$edu_year = str_replace("'", "\'", $_POST[edu_year]);
$edu_term = str_replace("'", "\'", $_POST[edu_term]);
$subj_key = str_replace("'", "\'", $_POST[subj_key]);
$section = str_replace("'", "\'", $_POST[section]);

$client1 = new SoapClient("https://jfklib.oas.psu.ac.th/services/searchservice.asmx?WSDL");
$client2 = new SoapClient("https://jfklib.oas.psu.ac.th/services/commonservice.asmx?WSDL");

$StartRecord = ($page_select - 1) * 10 + 1;
$EndRecord = $StartRecord + 10;
$search = array(
	"SearchTerm" => "$keyword", "SearchType" => "$type_keyword", "SearchLimit" => "", "StartRecord" => $StartRecord, "EndRecord" => $EndRecord, "Username" => "kittisak.k"
);
$result = $client1->Search($search);

$result =  (array) $result;
$result =  (array) $result[SearchResult];
$result =  (array) $result;
$result =  $result[0];
$result =  json_decode($result);
$count = count($result);
echo "พบทั้งหมด " . $result[0]->ROWSCOUNT . " รายการ<br>";
$page_count = ($result[0]->ROWSCOUNT - ($result[0]->ROWSCOUNT % 10)) / 10;
if ($result[0]->ROWSCOUNT % 10 > 0) {
	$page_count++;
}
//print_r($result);
if ($page_select == '1') {
	echo "ถัดไป";
} else {
	$page_select1 = $page_select - 1;
	echo "&nbsp;&nbsp;<a onclick=\"saveResult('โปรดรอสักครู่ <img src=\'https://sdss.oas.psu.ac.th/loader.gif\' width=\'120\'>','search_result');startRequest('POST','search_alist.php?page_select=$page_select1','search_result',document.search_alist)\" style='cursor:pointer'>ก่อนหน้า</a>";
}

echo "&nbsp;&nbsp;<input type='button' value='ไป' onclick=\"startRequest_alt('POST','search_alist.php?page_select=','search_result',document.search_alist,this.form.page_select.value);saveResult('โปรดรอสักครู่ <img src=\'https://sdss.oas.psu.ac.th/loader.gif\' width=\'120\'>','search_result');\"> <input type='text' name='page_select' onkeypress='return event.charCode >= 48 && event.charCode <= 57' value='$page_select' size='2' style='text-align: center;' > / $page_count";
if ($page_count == $page_select) {
	echo "ถัดไป";
} else {
	$page_select1 = $page_select + 1;
	echo "&nbsp;&nbsp;<a onclick=\"saveResult('โปรดรอสักครู่ <img src=\'https://sdss.oas.psu.ac.th/loader.gif\' width=\'120\'>','search_result');startRequest('POST','search_alist.php?page_select=$page_select1','search_result',document.search_alist)\" style='cursor:pointer'>ถัดไป</a>";
}
//for($i=1;$i<=$page_count;$i++){
//	echo$i."&nbsp;&nbsp;";
//}

echo "<td id='search_result'>";
for ($i = 0; $i < $count; $i++) {
	$call_no = '';
	$editon = '';
	$published = '';
	$author = '';
	$detail1 = '';
	$title = '';
	$isbn = '';
	//					this.form.bib.value+\" \"+this.form.call_no.value+\" \"+this.form.title.value

	echo "
			<form name='bib$i'>
			<input type='hidden' name='bib' value='" . $result[$i]->BIBNO . "'>
			<table class='table-text'>
				<!--<tr>
					<td>ลำดับที่&nbsp;:&nbsp;</td>
					<td>" . $result[$i]->RECORDNO . "&nbsp;&nbsp;<input type='button' value='เลือกเล่มนี้' onclick=\"alert('bib:'+this.form.bib.value+'\\n'+'call no:'+this.form.call_no.value+'\\n'+'title:'+this.form.title.value)\" > </td>

				</tr>-->
                
                <tr>
					<td>ลำดับที่&nbsp;:&nbsp;</td>
					<td>" . $result[$i]->RECORDNO . "&nbsp;&nbsp;<input type='button' value='เลือกเล่มนี้' onclick=\"SendBook('- เลขเรียก '+this.form.call_no.value+' ชื่อเรื่อง '+this.form.title.value)\" > </td>
				</tr>
				<tr>
					<td>Bib NO.</td>
					<td>" . $result[$i]->BIBNO . "</td>
				</tr>
			";

	//select_bib(document.add_bib,this.form
	//			<tr>
	//				<td>BIBNO&nbsp;:&nbsp;</td>
	//					<td>".$result[$i]->BIBNO."&nbsp;&nbsp;</td>
	//			</tr>
	$bibno = array(
		"BibNo" => $result[$i]->BIBNO
		//		"BibNo"=>1090417			
	);
	$detail = $client2->GetBibFull($bibno);
	$detail2 = $client2->GetItems($bibno);

	$detail =  (array) $detail;
	$detail =  (array) $detail[GetBibFullResult];
	$detail =  (array) $detail;
	$detail =  $detail[0];
	$detail =  json_decode($detail);

	$detail2 =  (array) $detail2;
	$detail2 =  (array) $detail2[GetItemsResult];
	$detail2 =  (array) $detail2;
	$detail2 =  $detail2[0];
	$detail2 =  json_decode($detail2);

	$count_detail = count($detail);
	$count_detail2 = count($detail2);
	for ($j = 0; $j < $count_detail; $j++) {
		echo "
			<tr>
				<td>" . $detail[$j]->TagName . "(" . $detail[$j]->TagCode . ")</td>
				<td>" . $detail[$j]->NonMARCData . "</td>
			</tr>
		";
		switch ($detail[$j]->TagCode) {
			case "245":
				$title = $detail[$j]->NonMARCData;
				break; //title
			case "020":
				$isbn = str_replace("'", "\'", $detail[$j]->NonMARCData);
				break; //ISBN
			case "022":
				$isbn = str_replace("'", "\'", $detail[$j]->NonMARCData);
				break; //ISSN
			case "090":
				$call_no .= str_replace("'", "\'", $detail[$j]->NonMARCData);
				break; //Dewey 
			case "082":
				$call_no .= str_replace("'", "\'", $detail[$j]->NonMARCData);
				break; //lc
			case "100":
				$author .= str_replace("'", "\'", $detail[$j]->NonMARCData);
				break; //Author
			case "250":
				$editon .= str_replace("'", "\'", $detail[$j]->NonMARCData);
				break; //Edition
			case "260":
				$published .= str_replace("'", "\'", $detail[$j]->NonMARCData);
				break; //Published
			case "773":
				$detail1 .= str_replace("'", "\'", $detail[$j]->NonMARCData);
				break; //Source
			case "700":
				$author .= str_replace("'", "\'", $detail[$j]->NonMARCData);
				break; //Author
		}
	}
	$title = explode('/', $title);
	$title_count = count($title);
	$title1 = '';
	for ($i_title = 0; $i_title <= $title_countl; $i_title++) {
		$title1 .= $title[$i_title];
	}
	echo "
		<input type='hidden' name='title' value=\"$title1\">
		<input type='hidden' name='isbn' value='$isbn'>
		<input type='hidden' name='call_no' value='$call_no'>
		<input type='hidden' name='editon' value='$editon'>
		<input type='hidden' name='published' value='$published'>
		<input type='hidden' name='author' value='$author'>
		<input type='hidden' name='detail1' value='$detail1'>
		<input type='hidden' name='subj_key' value='$subj_key' />
		<input type='hidden' name='edu_year' value='$edu_year' />
		<input type='hidden' name='edu_term' value='$edu_term' />
		<input type='hidden' name='section' value='$section'>

	";
	echo "
				</td>
			</tr>
			<tr>
				<td>ITEM</td>
				<td>
					<table>
						<tr>
							<td width=''>Barcode</td>
							<td>สถานะ</td>
						</tr>
			";

	for ($k = 0; $k < $count_detail2; $k++) {
		echo "<tr>";
		echo "	<td>" . $detail2[$k]->Barcode . "</td>";
		echo "	<td>" . $detail2[$k]->Status . "</td>";
		echo "<tr>";
	}
	echo "
					</table>
				</td>
			</tr>
		</table>
	</form>
	<hr>
	";
}
echo "<br>";
//print_r($result);
