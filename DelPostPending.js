var groupid = GetGroupID();
var fbdtsg = '';
getdtsg();
function getdtsg() {
	if(document.querySelector('input[name="fb_dtsg"]') != null) {
		fbdtsg = document.querySelector('input[name="fb_dtsg"]').getAttribute('value');
		document.querySelector('button[data-testid="delete_post_confirm_button"]').click();
		Change('Pending Posts');
		DelPOST();
		return true;
	} else {
		document.querySelector('div a[data-hover="tooltip"][data-tooltip-content="Delete"]').click();
		//Change('Pending Posts');
		console.log('Không tìm thấy dtsg, thử lại sau 3s');
		setTimeout(function() {getdtsg();}, 3000);
		return false;
	}
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
	console.log('Chuyển trang '+spantext);
	a = document.querySelectorAll('li a span:first-child');
	for(var i=0; i<a.length; i++) {
		if(a[i].innerText.indexOf(spantext) > -1) {
			a[i].click();
		}
	}
}
function DelPOST() {
	x = document.querySelector('div a[data-hover="tooltip"][data-tooltip-content="Delete"]');
	if(x == null) {
		window.scrollTo(0,document.body.scrollHeight);
		console.log('Tải thêm bài viết ...');
		setTimeout(function() {DelPOST();}, 1000);
		return;
	}
	id = x.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute('id').split('_')[2].toString();
	x.parentNode.parentNode.parentNode.parentNode.innerHTML = 'ok';
	var request = new XMLHttpRequest();
	request.open('POST', 'https://www.facebook.com/ajax/groups/mall/delete.php?dpr=1', true);
	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	request.send('fb_dtsg='+fbdtsg+'&group_id='+groupid+'&message_id='+id+'&confirmed=1&pending=1&source=&story_dom_id=mall_post_'+id+'&revision_id=&inner_tab=&surface=&location=&__user='+getCookie('c_user')+'&__a=1&__dyn=&__req=292&__be=1&__pc=PHASED%3ADEFAULT&__rev=&jazoest=&__spin_r=&__spin_b=trunk&__spin_t=');
	console.log('xóa bài viết '+id+' thành công');
	setTimeout(function() {DelPOST();}, 2000);
}
