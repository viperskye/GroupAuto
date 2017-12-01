var thoigian = prompt('Vui lòng nhập time refresh tính bằng giây');
var groupid = GetGroupID();
var fbdtsg = '';
function getdtsg() {
	if(document.querySelector('input[name="fb_dtsg"]') != null) {
		fbdtsg = document.querySelector('input[name="fb_dtsg"]').getAttribute('value');
		return true;
	} else {
		//Change('Pending Posts');
		console.log('Không tìm thấy dtsg, thử lại sau 3s');
		setTimeout(function() {getdtsg();}, 3000);
		return false;
	}
}
function DelUser(uid,gid,dtsg,isband) {
	var band = isband ? '&ban_user=1' : '';
	var request = new XMLHttpRequest();
	request.open('POST', 'https://www.facebook.com/ajax/groups/members/remove.php?group_id='+gid+'&uid='+uid+'&is_undo=0&source=profile_browser&dpr=1.5',true);
	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	request.send('fb_dtsg='+dtsg+'&confirm=true'+band+'&__user='+getCookie('c_user')+'&__a=1&__dyn=&__req=t&__be=1&__pc=PHASED%3ADEFAULT&__rev=&jazoest=&__spin_r=&__spin_b=trunk&__spin_t=');
	var thongbao = isband ? 'Xóa và chặn tài khoản '+uid+' khỏi group '+gid : 'Xóa tài khoản '+uid+' khỏi group '+gid;
	console.log(thongbao);
}
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length,c.length);
        }
    }
    return "";
}
function GetGroupID() {
	a = document.querySelector('meta[property="al:android:url"]').getAttribute('content').split('/');
	return a[a.length-1].toString();
}
function Change(spantext) {
	a = document.querySelectorAll('li a span:first-child');
	for(var i=0; i<a.length; i++) {
		if(a[i].innerText.indexOf(spantext) > -1) {
			a[i].click();
		}
	}
}
function toInt(a) {
	return (a == null || isNaN(parseInt(a))) ? 0 : parseInt(a);
}
function ApproveUser(oid) {
	if(document.querySelector('div#groupsUnifiedQueueTitle span').innerText != 'Member Requests') {
		console.log('Chưa tải xong trang, thử lại sau 3s');
		setTimeout(function() {ApproveUser(oid);}, 3000);
	} else {
		var x = document.querySelector('#member_requests_pagelet button[name="approve"]')
		if(x != null) {
			userid = x.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute('data-testid');
			if(userid == oid) {
				console.log('Có lỗi xảy ra với tài khoản, xóa yêu cầu và chặn khỏi group tài khoản : '+userid.toString());
				DelUser(userid,gid,dtsg,true);
			}
			if(x.parentNode.parentNode.lastChild.lastChild.lastChild.innerText.indexOf('answered questions yet') == -1) {
				console.log('Phê duyệt tài khoản '+userid.toString());
				x.click()
				x.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.innerHTML = 'ok';
				setTimeout(function() {ApproveUser(userid);}, 3000);
				return;
			} else {
				console.log('Từ chối tài khoản '+ userid.toString());
				x.parentNode.childNodes[1].click();
				x.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.innerHTML = 'ok';
				setTimeout(function() {ApproveUser(userid);}, 3000);
				return;
			}
		}
		Change('Member Requests');
		console.log('Không tìm thấy yêu cầu tham gia mới, thử lại sau :'+thoigian.toString());
		setTimeout(function() {ApproveUser('');}, thoigian*1000);
	}
}
ApproveUser('');