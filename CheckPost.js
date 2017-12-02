var thoigian = prompt('Vui lòng nhập time refresh tính bằng giây');
var t = prompt('Vui lòng nhập từ khóa, chia tách bằng dấu "," bỏ trống để sử dụng từ khóa được nhập lần gần nhất');
var keyword = GetKeyword(t);
var groupid = GetGroupID();
var fbdtsg = '';
getdtsg();
function getdtsg() {
	if(document.querySelector('input[name="fb_dtsg"]') != null) {
		fbdtsg = document.querySelector('input[name="fb_dtsg"]').getAttribute('value');
		return true;
	} else {
		Change('Pending Posts');
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
if(localStorage.getItem('Band_day') == null) localStorage.setItem('Band_day',gday().toString());
if(localStorage.getItem('Band_day') != gday.toString()) localStorage.setItem(groupid+'_band','');
function GetGroupID() {
	a = document.querySelector('meta[property="al:android:url"]').getAttribute('content').split('/');
	return a[a.length-1].toString();
}
function GetKeyword(t) {
	if(t == '') {
  	if(localStorage.getItem('keyword') == null) {
    	t = promt('Không tìm thấy từ khóa cũ, vui lòng nhập mới từ khóa, chia tách bằng dấu ","');
		GetKeyword(t);
    } else {
    	return localStorage.getItem('keyword').split(',');
    }
  } else {
  	temp = t.toLowerCase()+','+xoa_dau(t).toLowerCase();
    localStorage.setItem('keyword',temp);
    return temp.split(',');
  }
}
function indexofObject(content,key) {
	for(var i=0; i<key.length; i++) {
		if(content.indexOf(key[i]) > -1) {
			return true;
		}
	}
	return false;
}
function gday() {
	var d = new Date();
	return d.getDate();
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
function ApprovePost() {
	if(document.querySelector('div#groupsUnifiedQueueTitle span').innerText != 'Pending Posts') {
		setTimeout(function() {ApprovePost()}, 3000);
	} else {
		x = document.querySelector('div a[data-hover="tooltip"][data-tooltip-content="Approve"]');
		if(x != null) {
			if(indexofObject(x.parentNode.parentNode.parentNode.lastChild.innerText.toLowerCase(),keyword) == true) {
				temp = x.parentNode.parentNode.parentNode.lastChild.querySelector('div div a').getAttribute('data-hovercard').toString();
				userid = temp.slice(temp.indexOf('=')+1,temp.indexOf('&'));
				kt = (localStorage.getItem(groupid+'_band') != null) ? localStorage.getItem(groupid+'_band') : '';
				if(kt.indexOf(userid) > -1) {
					console.log('User '+userid+' đã bị khóa, xóa bài viết');
					IsContinue = false;
				} else {
					if(toInt(localStorage.getItem(userid+'_'+groupid+'_'+gday().toString())) < 3) {
						console.log('User '+userid+' : Phê duyệt bài viết ');
						oldday = toInt(gday()) - 1;
						localStorage.removeItem(userid+'_'+oldday.toString());
						today = gday().toString();
						(localStorage.getItem(userid+'_'+groupid+'_'+today) != null) ? localStorage.setItem(userid+'_'+groupid+'_'+today,toInt(localStorage.getItem(userid+'_'+groupid+'_'+today))+1) : localStorage.setItem(userid+'_'+groupid+'_'+today,1);
						IsContinue = true;
					} else {
						console.log('User '+userid+'đã quá số lượng post cho phép, xóa bài viết');
						kt = kt+','+userid;
						localStorage.setItem(groupid+'_band',kt);
						IsContinue = false;
					}
				}
				if(!IsContinue) {
					idpost = x.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute('id').split('_')[2];
					Delpost(idpost);
					DelUser(uid,groupid,fbdtsg,false);
					return false;
				} else {
					x.click();
					setTimeout(function() {ApprovePost();}, 2000);
					return true;
				}
			} else {
				idpost = x.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute('id').split('_')[2];
				console.log('Bài viết không chứa từ khóa, xóa bài viết');
				Delpost(idpost);
				return;
			}
		}
		Change('Pending Posts');
		console.log('Không tìm thấy bài viết mới, thử lại sau : '+thoigian.toString()+'s');
		setTimeout(function() {ApprovePost();}, (thoigian+5)*1000);
		return;
	}
}
Delpost = function(arr,i) {
	console.log('bắt đầu xóa ' +arr);
	if(localStorage.getItem('IsClickd') == 'true') {
		if(document.querySelector('button[data-testid="delete_post_confirm_button"]') != null) {
			localStorage.setItem('IsClickd', 'false');
			document.querySelector('button[data-testid="delete_post_confirm_button"]').click();
			console.log('click nút xóa');
			setTimeout(function() {ApprovePost();}, 2000);
		} else {
			if(i > 3) {
				localStorage.setItem('IsClicđ', 'false');
				console.log('Có lỗi xảy ra với bài viết, chuyển qua bài kế tiếp');
				setTimeout(function() {ApprovePost();}, 2000);
				return;
			}
			console.log('Chưa có nút xóa');
			setTimeout(function() {Delpost(arr,i+1);}, 2000);
			return;
		}
	} else {
		x = arr.toString();
		localStorage.setItem('IsClickd','true');
		console.log(x);
		document.querySelector('div#mall_post_'+x+' a[data-hover="tooltip"][data-tooltip-content="Delete"]').click();
		setTimeout(function() {Delpost(arr);}, 2000);
	}
}
function xoa_dau(str) {
    str = str.replace('/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g', "a");
    str = str.replace('/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g', "e");
    str = str.replace('/ì|í|ị|ỉ|ĩ/g', "i");
    str = str.replace('/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g', "o");
    str = str.replace('/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g', "u");
    str = str.replace('/ỳ|ý|ỵ|ỷ|ỹ/g', "y");
    str = str.replace('/đ/g', "d");
    return str;
}
ApprovePost();