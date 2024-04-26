var xmlHttp = null;
function createXMLHttpRequest() {
	if (window.ActiveXObject) {//if(window.ActiveXObject){;
		xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
	} else if (window.XMLHttpRequest) {//if(window.ActiveXObject){
		xmlHttp = new XMLHttpRequest();
	}//if(window.ActiveXObject){
}

function startRequest_alt(POST, url, frm, obj, alt) {
	url1 = url + alt;
	startRequest(POST, url1, frm, obj);
}

function startRequest(method, url, frm, obj) {
	createXMLHttpRequest();
	if (obj) {
		var pBody = getRequestBody(obj);
		xmlHttp.open(method, url, true)
		xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xmlHttp.send(pBody);
	} else {
		xmlHttp.open(method, url, true)
		xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xmlHttp.send(null);
	}
	xmlHttp.onreadystatechange = function () {
		if (xmlHttp.readyState == 4) {
			if (xmlHttp.status == 200) {
				saveResult(xmlHttp.responseText, frm);
			} else {
				alert(xmlHttp.statusText);
			}
		}
	}
}

function check_login(obj) {
	method = "POST";
	url = "login1.php";
	frm = "frmMain"
	createXMLHttpRequest();
	var pBody = getRequestBody(obj);
	xmlHttp.open(method, url, true)
	xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xmlHttp.send(pBody);
	xmlHttp.onreadystatechange = function () {
		if (xmlHttp.readyState == 4) {
			if (xmlHttp.status == 200) {
				//				alert(xmlHttp.responseText);
				if (xmlHttp.responseText == 1) {
					startRequest('POST', 'index.php?page=login', 'top_page')
				} else if (xmlHttp.responseText == 2) {
					startRequest('POST', 'login.php?action=x1', 'frmMain')
				} else if (xmlHttp.responseText == 4) {
					startRequest('POST', 'login.php?action=Regist_PSU_PASSPORT', 'frmMain')
				} else {
					startRequest('POST', 'login.php?action=x2', 'frmMain')
				}
				//				saveResult(xmlHttp.responseText,frm);
			} else {
				//				alert(xmlHttp.statusText);
			}
		}
	}
}

function getRequestBody(pForm) {
	var nParams = new Array();
	for (var i = 0; i < pForm.elements.length; i++) {
		var pParam = encodeURIComponent(pForm.elements[i].name);
		pParam += "=";
		pParam += encodeURIComponent(pForm.elements[i].value)
		nParams.push(pParam);
	}
	return nParams.join("&");
}

function saveResult(pMessage, frm) {
	var divStatus = document.getElementById(frm)
	divStatus.innerHTML = pMessage;
}

function more_click() {
	pMessage = "<table class='table table-bordered table-text'>";
	pMessage += "<tr class=command align=right>";
	pMessage += "	<td>";
	pMessage += "		<select name=con[]>";
	pMessage += "			<option value=and selected>And</option>";
	pMessage += "			<option value=or>Or</option>";
	pMessage += "			<option  value=not>Not</option>";
	pMessage += "		</select>";
	pMessage += "	</td>";
	pMessage += "	<td><input type='text' name='searchkey[]' size='60'></td>";
	pMessage += "	<td>";
	pMessage += "		<select name=search[]>";
	pMessage += "			<option value=1 selected>ชื่อเรื่อง/Title</option>";
	pMessage += "			<option value=2>บทคัดย่อ/Abstract</option>";
	pMessage += "			<option  value=4>ผู้ทำ/Author : Name</option>";
	pMessage += "			<option  value=5>ผู้ทำ/Author : Organization</option>";
	pMessage += "			<option  value=6>Publisher:</option>";
	pMessage += "			<option  value=7>Contributor:Name</option>";
	pMessage += "		</select>";
	pMessage += "	</td>";
	pMessage += "</tr>";
	pMessage += "</table>";

	var divStatus = document.getElementById('frmSearch');
	divStatus.innerHTML = divStatus.innerHTML + pMessage;
}

function startRequest1(method, url, frm, obj) {
	createXMLHttpRequest();
	var pBody = getRequestBody(obj);
	xmlHttp.open(method, url, true)
	xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xmlHttp.send(pBody);

	xmlHttp.onreadystatechange = function () {
		if (xmlHttp.readyState == 4) {
			if (xmlHttp.status == 200) {
				saveResult(xmlHttp.responseText, frm)
			} else {
				alert(xmlHttp.statusText);
			}
		}
	}
}

//--- page ---
var nPageTimeout = 10; // 
function pageTimeout() {
	//	if(!nPageTimeout--)
	//		window.location.href = '/?action=timeout';
	//	else
	//		window.setTimeout('pageTimeout();', 60000);
}

function check_user(obj) {
	if ((obj.value.length < 5) || (obj.value.length > 15)) {
		alert('User Name ต้องอยู่ระหว่าง 5 ถึง 15 ตัวอักษร');
		obj.focus()
	} else {
		createXMLHttpRequest();
		xmlHttp.open("GET", "check_user.php?user=" + obj.value, true)
		xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xmlHttp.send(null);
		alert("กำลังตรวจสอบ");
		alert(xmlHttp.responseText);
		if (xmlHttp.responseText == "สามารถใช้ username นี้ได้") {
			divChild = document.getElementById('usernametip');
			divChild.style.display = 'none'
			document.register_form.username.disabled = true;
			document.register_form.button_check_user.disabled = true;
			document.register_form.password.disabled = false;
			document.register_form.password1.disabled = false;
			document.register_form.button_check_pwd.disabled = false;
			document.register_form.password.focus();
			divChild = document.getElementById('passwordtip');
			divChild.style.display = ''
		} else {
			form_status(document.register_form, true);
			document.register_form.username.disabled = false;
			document.register_form.button_check_user.disabled = false;
		}
	}
}

function check_password(pwd1, pwd2) {
	if (pwd1.length < 5) {
		alert('Password ต้อง มีมากกว่า 5 ตัวอักษร');
	} else {
		if (pwd1 != pwd2) {
			alert('กรุณาพิมพ์ Password ใหม่ให้เหมือนกันด้วย');
			this.value = '';
			this.form.password.value = '';
			document.register_form.password.focus();
		} else {
			alert('ยอมรับ Password');
			divChild = document.getElementById('passwordtip');
			divChild.style.display = 'none'
			form_status(document.register_form, false);
			document.register_form.username.disabled = true;
			document.register_form.password.disabled = true;
			document.register_form.password1.disabled = true
			document.register_form.send_form.disabled = true;
			document.register_form.name.focus();
		}
	}
}
function check_email(obj) {
	createXMLHttpRequest();
	xmlHttp.open("GET", "check_mail.php?email=" + obj, true)
	xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xmlHttp.send(null);
	alert("กำลังตรวจสอบ");
	message = xmlHttp.responseText;
	if (message == 1) {
		alert("สามารถใช้ อีเมล นี้ได้");
		document.register_form.email.disabled = true;
		document.register_form.send_form.disabled = false;
		document.register_form.address.focus();
	} else {
		alert("มี อีเมล นี้ในระบบแล้วกรุณาเปลี่ยนใหม่ด้วย");
		document.register_form.email.disabled = false;
		document.register_form.send_form.disabled = false;
	}
}

//ill_staff.php
var cstaff1 = 0;
var cstaff2 = 0

function logout() {
	startRequest('POST', 'logout.php', 'frmMain');
	startRequest('POST', 'index.php?page=logout', 'top_page');
}

function copy_bib(bib_id) {
	var script = document.createElement('script');
	script.src = 'copy_bib.php?bib_id=' + bib_id;
	document.head.appendChild(script);
}

function copy_file(file_id) {
	var script = document.createElement('script');
	script.src = 'copy_file.php?file_id=' + file_id;
	document.head.appendChild(script);
}

function paste_bib(subj_key, year, term, section) {
	var script = document.createElement('script');
	script.src = 'paste_bib.php?subj_key=' + subj_key + '&edu_year=' + year + '&edu_term=' + term + '&section=' + section;
	document.head.appendChild(script);
}

function paste_file(subj_key, year, term, section) {
	var script = document.createElement('script');
	script.src = 'paste_file.php?subj_key=' + subj_key + '&edu_year=' + year + '&edu_term=' + term + '&section=' + section;
	document.head.appendChild(script);
}

function del_bib(bib_id) {
	var script = document.createElement('script');
	script.src = 'del_bib.php?bib_id=' + bib_id;
	document.head.appendChild(script);
}

function del_file(file_id) {
	var script = document.createElement('script');
	script.src = 'del_file.php?file_id=' + file_id;
	document.head.appendChild(script);
}

function del_subj_bib(subj_key, year, term, section, person, bib_id) {
	if (confirm("คุณต้องการลบทรัพยากรนี้หรือไม่")) {
		var script = document.createElement('script');
		script.src = 'del_subj_bib.php?subj_key=' + subj_key + '&edu_year=' + year + '&edu_term=' + term + '&section=' + section + '&person=' + person + '&bib_id=' + bib_id;
		document.head.appendChild(script);
	}
}

function del_subj_file(subj_key, year, term, section, person, file_id) {
	if (confirm("คุณต้องการลบทรัพยากรนี้หรือไม่")) {
		var script = document.createElement('script');
		script.src = 'del_subj_file.php?subj_key=' + subj_key + '&edu_year=' + year + '&edu_term=' + term + '&section=' + section + '&person=' + person + '&file_id=' + file_id;
		document.head.appendChild(script);
	}
}

function add_bib2(obj) {
	//	alert(obj)

	createXMLHttpRequest();
	method = 'POST'
	url = 'add_bib2.php'
	if (obj) {
		var pBody = getRequestBody(obj);
		xmlHttp.open(method, url, true)
		xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xmlHttp.send(pBody);
	}
	xmlHttp.onreadystatechange = function () {
		if (xmlHttp.readyState == 4) {
			if (xmlHttp.status == 200) {
				var script = document.createElement('script');
				script.innerHTML = xmlHttp.responseText;
				document.head.appendChild(script);
				//alert(xmlHttp.responseText);
				//				saveResult(xmlHttp.responseText,frm);
			} else {
				alert(xmlHttp.statusText);
			}
		}
	}
	/*
			var script = document.createElement('script');
			script.src = 'add_bib2.php'
			document.head.appendChild(script);
	*/
}


function SendBook(item, id) {

	//var listno = (id+1);
	//let click = 0;
	/*click = click+1;
	alert(click);
	click++;
	*/
	document.getElementById("input_5_13").value += item + '\n';
};