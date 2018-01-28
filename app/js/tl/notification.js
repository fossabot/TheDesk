//通知
//取得+Streaming接続
function notf(acct_id, tlid, sys) {
	todo("Notifications Loading...");
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem(domain + "_at");
	var start = "https://" + domain + "/api/v1/notifications";
	fetch(start, {
		method: 'GET',
		headers: {
			'content-type': 'application/json',
			'Authorization': 'Bearer ' + at
		},
		//body: JSON.stringify({})
	}).then(function(response) {
		return response.json();
	}).catch(function(error) {
		todo(error);
		console.error(error);
	}).then(function(json) {
		var templete = parseNotf(json, -1, tlid, acct_id);
		if (sys == "direct") {
			$("#timeline_" + tlid).html(templete[0]);
		} else {
			$("#notifications_" + tlid).html(templete[0]);
		}

		jQuery("time.timeago").timeago();
		$("#notf-box").addClass("fetched");
		todc();
	});
	var start = "wss://" + domain + "/api/v1/streaming/?stream=user&access_token=" +
		at;

	console.log(start);
	var websocket = new WebSocket(start);
	console.log(websocket);
	websocket.onopen = function(mess) {
		console.log("Connect Streaming API:");
		console.log(mess);
	}
	websocket.onmessage = function(mess) {
		console.log("Receive Streaming API:");

		var obj = JSON.parse(JSON.parse(mess.data).payload);
		console.log(obj);
		var type = JSON.parse(mess.data).event;
		if (type == "notification") {
			var popup = localStorage.getItem("popup");
			if (!popup) {
				popup = 0;
			}
			var templete = parseNotf([obj], popup, tlid, acct_id);
			var notices = templete[1];
			console.log(templete);
			if (sys == "direct") {
				$("#timeline_" + tlid).prepend(templete[0]);
			} else {
				$("#notifications_" + tlid).prepend(templete[0]);
			}
			jQuery("time.timeago").timeago();
		}

	}
	websocket.onerror = function(error) {
		console.error('WebSocket Error ' + error);
	};
}

//通知トグルボタン
function notfToggle(acct, tlid) {
	$("#notf-box_" + tlid).toggleClass("hide");
	if (!$("#notf-box_" + tlid).hasClass("fetched")) {
		notf(acct, tlid);
	}
	$(".notf-icon_" + tlid).removeClass("red-text");
}

//通知オブジェクトパーサー
function parseNotf(obj, popup, tlid, acct_id) {
	var templete = '';
	var datetype = localStorage.getItem("datetype");
	var nsfwtype = localStorage.getItem("nsfw");
	if (!nsfwtype || nsfwtype == "yes") {
		var nsfw = "ok";
	} else {
		var nsfw;
	}
	var cwtype = localStorage.getItem("cw");
	if (!cwtype || cwtype == "yes") {
		var cw = "ok";
	} else {
		var cw;
	}
	if (!datetype) {
		datetype = "absolute";
	}
	Object.keys(obj).forEach(function(key) {
		var eachobj = obj[key];
		var toot = eachobj.status;
		//トゥートである
		if (toot) {
			if (!toot.application) {
				var via = "<i>Unknown</i>";
			} else {
				var via = toot.application.name;
			}
			if (toot.account.locked) {
				var locked = ' <i class="fa fa-lock red-text"></i>';
			} else {
				var locked = "";
			}
			var id = toot.id;
			if (eachobj.type == "mention") {
				var what = "返信しました";
			} else if (eachobj.type == "reblog") {
				var what = "ブーストしました";
			} else if (eachobj.type == "favourite") {
				var what = "ふぁぼしました";
			}
			var noticetext = eachobj.account.display_name + "(" + eachobj.account.acct +
				")が" + what;
			if (popup >= 0 && obj.length < 5) {
				Materialize.toast(noticetext, popup * 1000);
				$(".notf-icon_" + tlid).addClass("red-text");
			}
			if (toot.spoiler_text && cw) {
				var spoiler = "cw cw_hide_" + toot.id;
				var spoiler_show = '<a onclick="cw_show(\'' + toot.id + '\')">見る</a>';
			} else {
				var spoiler = "";
				var spoiler_show = "";
			}
			var viewer = "";
			var youtube = "";
			var mediack = toot.media_attachments[0];
			if (mediack) {
				Object.keys(toot.media_attachments).forEach(function(key2) {
					var media = toot.media_attachments[key2];
					var purl = media.preview_url;
					var url = media.url;
					if (toot.sensitive && nsfw) {
						var sense = "sensitive"
					} else {
						var sense = ""
					}
					viewer = viewer + '<a onclick="imgv(\'' + url + '\',\'' + toot.account
						.acct + '\',\'' + media.type + '\')"><img src="' + purl + '" class="' +
						sense +
						'" width="250" style="object-fit: cover; width: 100%; height: 200px;"></a></span>';
				});
			} else {
				viewer = "";
			}
			var menck = toot.mentions[0];
			var mentions = "";
			if (menck) {
				mentions = "Links: ";
				Object.keys(toot.mentions).forEach(function(key3) {
					var mention = toot.mentions[key3];
					mentions = mentions + '<a onclick="udg(\'' + mention.id +
						'\')" class="pointer">@' + mention.acct + '</a> ';
				});
			}
			var tagck = toot.tags[0];
			var tags = "";
			if (tagck) {
				if (!menck) {
					tags = "Links: ";
				}
				Object.keys(toot.tags).forEach(function(key4) {
					var tag = toot.tags[key4];
					tags = tags + '<a onclick="tl(\'tag\',\'' + tag.name +
						'\')" class="pointer">#' + tag.name + '</a> ';
				});
			}
			if (toot.favourited) {
				var if_fav = " yellow-text";
				var fav_app = "faved";
			} else {
				var if_fav = "";
				var fav_app = "";
			}
			if (toot.reblogged) {
				var if_rt = "teal-text";
				var rt_app = "rted";
			} else {
				var if_rt = "";
				var rt_app = "";
			}
			if (toot.account.acct == localStorage.getItem("user_" + acct_id)) {
				var if_mine = "";
			} else {
				var if_mine = "hide";
			}
			if (toot.favourited) {
				var if_fav = " yellow-text";
				var fav_app = "faved";
			} else {
				var if_fav = "";
				var fav_app = "";
			}
			if (toot.reblogged) {
				var if_rt = "teal-text";
				var rt_app = "rted";
			} else {
				var if_rt = "";
				var rt_app = "";
			}
			templete = templete + '<div each=' + toot.datab + ' id="pub_' + toot.id +
				'" class="cvo ' + fav_app + ' ' + rt_app +
				'" style="padding-top:5px;" notf-id="' + eachobj.id + '">' +
				'<span class="gray sharesta">' + noticetext +
				'<br><span class="cbadge"><i class="fa fa-clock-o"></i>' + date(eachobj.created_at,
					datetype) + '</span></span>' +
				'<div style="padding:0; margin:0; width:400px; max-width:100%; display:flex; align-items:flex-end;">' +
				'<div style="flex-basis:40px;"><a onclick="udg(\'' + toot.account.id +
				'\',\'' + acct_id + '\');" user="' + toot.account.acct + '" class="udg">' +
				'<img src="' + toot.account.avatar +
				'" width="20" class="prof-img" user="' + toot.account.acct +
				'"></a></div>' +
				'<div style="flex-grow:3; overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">' +
				toot.account.display_name + '</div>' +
				'<div class="sml gray" style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;"> @' +
				toot.account.acct + locked + '</div>' +
				'</div>' +
				'<span class="toot ' + spoiler + '">' + toot.content +
				'</span><span class="gray cw_text_' + toot.id + '">' + toot.spoiler_text +
				spoiler_show + '</span>' +
				'' + viewer + '' +
				'<div class="additional"></div><span class="cbadge"><i class="fa fa-clock-o"></i>' +
				date(toot.created_at, datetype) + '</span>' +
				'<span class="cbadge">via ' + via + '</span>' + mentions + tags +
				'<div style="padding:0; margin:0; top:-20px; display:flex; justify-content:space-around; width:500px; max-width:100%; ">' +
				'<div><a onclick="re(\'' + toot.id + '\',\'' + toot.account.acct + '\',' +
				acct_id +
				')" class="waves-effect waves-dark btn-flat" style="padding:0"><i class="fa fa-share"></i><help>返信</help></a></div>' +
				'<div><a onclick="rt(\'' + toot.id + '\',' + acct_id +
				')" class="waves-effect waves-dark btn-flat" style="padding:0"><i class="text-darken-3 fa fa-retweet ' +
				if_rt + '"  id="rt_' + toot.id + '"></i><span class="rt_ct">' + toot.reblogs_count +
				'</span><help>ブースト</help></a></div>' +
				'<div><a onclick="fav(\'' + toot.id + '\',' + acct_id +
				')" class="waves-effect waves-dark btn-flat" style="padding:0"><i class="fa text-darken-3 fa-star' +
				if_fav + '" id="fav_' + toot.id + '"></i><span class="fav_ct">' + toot.favourites_count +
				'<help>お気に入り</help></a></span></div>' +
				'<div class=' + if_mine + '><a onclick="del(\'' + toot.id + '\',' +
				acct_id +
				')" class="waves-effect waves-dark btn-flat" style="padding:0"><i class="fa fa-trash-o"></i><help>削除</help></a></div>' +
				'<div><a onclick="details(\'' + toot.id + '\',' + acct_id +
				')" class="waves-effect waves-dark btn-flat details" style="padding:0"><i class="text-darken-3 material-icons">more_vert</i><help>詳細表示</help></a></div>' +
				'</div>' +
				'<div class="divider"></div>' +
				'</div>' +
				'</div>';
		} else if (eachobj.type == "follow") {
			//フォロー等のユーザーデータである
			var tooter = eachobj.account;
			if (tooter.locked) {
				var locked = ' <i class="fa fa-lock red-text"></i>';
			} else {
				var locked = "";
			}
			templete = templete +
				'<div class="cvo " style="padding-top:5px;" notf-id=' + eachobj.id + '>' +
				'<div style="padding:0; margin:0; width:400px; max-width:100%; display:flex; align-items:flex-end;">' +
				'<div style="flex-basis:40px;"><a onclick="udg(\'' + tooter.id + '\',\'' +
				acct_id + '\');" user="' + tooter.acct + '" class="udg">' +
				'<img src="' + tooter.avatar + '" width="40" class="prof-img" user="' +
				tooter.acct + '"></a></div>' +
				'<div style="flex-grow:3; overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">' +
				tooter.display_name + '<div class="gray sharesta">にフォローされました</div></div>' +
				'<div class="sml gray" style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;"> @' +
				tooter.acct + locked + '</div>' +
				'</div>' +
				'<div style="justify-content:space-around"> <div class="cbadge">Follows:' +
				tooter.following_count + '</div><div class="cbadge">Followers:' + tooter.followers_count +
				'</div>' +
				'<div class="divider"></div>' +
				'</div>' +
				'</div>';
			var noticetext = eachobj.account.display_name + "(" + eachobj.account.acct +
				")がフォローしました";
			if (popup >= 0 && obj.length < 5) {
				Materialize.toast(noticetext, popup * 1000);
				$(".notf-icon").addClass("red-text");
			}
		}
	});
	if (!noticetext) {
		var noticetext = null;
	}
	return [templete, noticetext];
}