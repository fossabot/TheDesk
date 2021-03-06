function escapeHTMLtemp(str) {
	if(!str){
		return "";
	}
  return str.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#039;');
}
$.strip_tagstemp = function(str, allowed) {
	if(!str){
		return "";
	}
  	allowed = (((allowed || '') + '').toLowerCase().match(/<[a-z][a-z0-9]*>/g) || [])
  		.join('');
  	var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>?/gi,
  		commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
  	return str.replace(commentsAndPhpTags, '').replace(tags, function($0, $1) {
  		return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
  	});
  };
//オブジェクトパーサー(トゥート)
function misskeyParse(obj, mix, acct_id, tlid, popup, mutefilter) {
	var templete = '';
	localStorage.setItem("lastunix_"+ tlid,date(obj[0].createdAt, 'unix'));
	var actb = localStorage.getItem("action_btns");
	var actb='re,rt,fav,qt,del,pin,red';
	if(actb){
		var actb = actb.split(',');
		var disp={};
		for(var k=0;k<actb.length;k++){
			if(k<4){
				var tp="type-a";
			}else{
				var tp="type-b";
			}
			disp[actb[k]]=tp;
		}
	}
	var datetype = localStorage.getItem("datetype");
	var nsfwtype = localStorage.getItem("nsfw");
	var sent = localStorage.getItem("sentence");
	var ltr = localStorage.getItem("letters");
	var gif = localStorage.getItem("gif");
	var imh = localStorage.getItem("img-height");
	//ネイティブ通知
	var native=localStorage.getItem("nativenotf");
	if(!native){
		native="yes";
	}
	//クライアント強調
	var emp = localStorage.getItem("client_emp");
	if(emp){
		var emp = JSON.parse(emp);
	}
	//クライアントミュート
	var mute = localStorage.getItem("client_mute");
	if(mute){
		var mute = JSON.parse(mute);
	}
	//ユーザー強調
	var useremp = localStorage.getItem("user_emp");
	if(useremp){
		var useremp = JSON.parse(useremp);
	}
	//ワード強調
	var wordemp = localStorage.getItem("word_emp");
	if(wordemp){
		var wordemp = JSON.parse(wordemp);
	}
	//ワードミュート
	var wordmute = localStorage.getItem("word_mute");
	if(wordmute){
		var wordmute = JSON.parse(wordmute);
		wordmute = wordmute.concat(mutefilter);
	}else{
		wordmute = mutefilter;
	}
	//Ticker
	var tickerck = localStorage.getItem("ticker_ok");
	if(tickerck){
		var ticker=true;
	}else{
		var ticker=false;
	}
	if (!sent) {
		var sent = 500;
	}
	if (!ltr) {
		var ltr = 500;
	}
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
	if (!gif) {
		var gif = "yes";
	}
	if (!imh) {
		var imh = "200";
	}
	if(!emp){
		var emp=[];
	}
	if(!mute){
		var mute=[];
	}
	if(!useremp){
		var useremp=[];
	}
	if(!wordemp){
		var wordemp=[];
	}
	if(!wordmute){
		var wordmute=[];
	}
	//via通知
	var viashow=localStorage.getItem("viashow");
	if(!viashow){
		viashow="via-hide";
	}
	if(viashow=="hide"){
		viashow="via-hide";
	}
	//認証なしTL
	if(mix=="noauth"){
		var noauth="hide";
		var antinoauth="";
	}else{
		var noauth="";
		var antinoauth="hide";
	}
	//マウスオーバーのみ
	var mouseover=localStorage.getItem("mouseover");
	if(!mouseover){
		mouseover="";
	}else if(mouseover=="yes" || mouseover=="click"){
		mouseover="hide";
	}else if(mouseover=="no"){
		mouseover="";
	}
	var local = [];
	var times=[];
	Object.keys(obj).forEach(function(key) {
		var toot = obj[key];
        var dis_name=toot.user.name;
        if(dis_name){
            dis_name=escapeHTMLtemp(dis_name);
        }else{
			disname="";
		}
		if (mix == "notf") {
			if (gif == "yes") {
				noticeavatar = toot.user.avatarUrl;
			} else {
				noticeavatar = toot.user.avatarUrl;
			}
			noticeavatar='<a onclick="udg(\'' + toot.user.id +
			'\',' + acct_id + ');" user="' + toot.user.username + '" class="udg">' +
			'<img src="' + noticeavatar +
			'" width="20" class="notf-icon prof-img" user="' + toot.user.username +
			'"></a>';
			if (toot.type == "reply") {
				var what = lang.lang_parse_mentioned;
				var icon = '<i class="big-text fa fa-share teal-text"></i>';
				noticeavatar="";
			} else if (toot.type == "renote") {
				var what = lang.lang_misskeyparse_renoted;
				var icon = '<i class="big-text fa fa-retweet light-blue-text"></i>';
			}  else if (toot.type == "quote") {
				var what = lang.lang_misskeyparse_quoted;
				var icon = '<i class="big-text fa fa-quote-right orange-text"></i>';
			} else if (toot.type == "reaction") {
				var what = lang.lang_misskeyparse_reacted;
				var reactions={
					"like":"👍",
					"love":"💓",
					"laugh":"😁",
					"hmm":"🤔",
					"surprise":"😮",
					"congrats":"🎉",
					"amgry":"💢",
					"confused":"😥",
					"pudding":"🍮"
				}
				var icon=reactions[toot.reaction];
				var reactions=["like","love","laugh","hmm","surprise","congrats","angry","confused","pudding"];
                for(var i=0;i<reactions.length;i++){
                    if(toot.note.reactionCounts[reactions[i]]){
                        $("#pub_" + id +" .re-"+reactions[i]+"ct").text(toot.note.reactionCounts[reactions[i]])
                        $("#pub_" + id +" .re-"+reactions[i]).removeClass("hide")
                    }else{
                        $("#pub_" + id +" .re-"+reactions[i]+"ct").text(0)
                        if($("#pub_" + id +" .reactions").hasClass("fullreact")){
                            $("#pub_" + id +" .re-"+reactions[i]).addClass("hide")
                        }else{
                            $("#pub_" + id +" .re-"+reactions[i]).removeClass("hide")
                        }
                        $("#pub_" + id +" .re-"+reactions[i]+"ct").text(toot.note.reactionCounts[reactions[i]])
                    }
                }
			}else{
				var icon = '<i class="big-text material-icons indigo-text" style="font-size:17px">info</i>';
			}
			var noticetext = '<span class="cbadge cbadge-hover"title="' + date(toot.createdAt,
				'absolute') + '('+lang.lang_parse_notftime+')"><i class="fa fa-clock-o"></i>' + date(toot.createdAt,
				datetype) +
			'</span>'+icon+'<a onclick="udg(\'' + toot.user.username +
				'\',\'' + acct_id + '\')" class="pointer grey-text">' + dis_name +
				"(@" + toot.user.username +
				")</a>";
			var notice = noticetext;
			var memory = localStorage.getItem("notice-mem");
			if (popup >= 0 && obj.length < 5 && noticetext != memory) {
				if(localStorage.getItem("hasNotfC_" + acct_id)!="true"){
				if (toot.type == "reply") {
					var replyct=localStorage.getItem("notf-reply_" + acct_id)
					$(".notf-reply_" + acct_id).text(replyct*1-(-1));
					localStorage.setItem("notf-reply_" + acct_id,replyct*1-(-1))
					$(".notf-reply_" + acct_id).removeClass("hide")
				}else if (toot.type == "renote" || toot.type=="quote") {
					var btct=localStorage.getItem("notf-bt_" + acct_id)
					$(".notf-bt_" + acct_id).text(btct*1+1);
					localStorage.setItem("notf-bt_" + acct_id,btct*1-(-1))
					$(".notf-bt_" + acct_id).removeClass("hide")
				}else if (toot.type == "reaction") {
					var favct=localStorage.getItem("notf-fav_" + acct_id)
					$(".notf-fav_" + acct_id).text(favct*1-(-1));
					localStorage.setItem("notf-fav_" + acct_id,favct*1-(-1))
					$(".notf-fav_" + acct_id).removeClass("hide")
				}
				}
				var domain = localStorage.getItem("domain_" + acct_id);
				if(popup>0){
					Materialize.toast("["+domain+"]"+escapeHTMLtemp(toot.user.name)+what, popup * 1000);
				}
				if(native=="yes"){
					var electron = require("electron");
					var ipc = electron.ipcRenderer;
					var os = electron.remote.process.platform;
					var options = {
						body: toot.account.display_name+"(" + toot.account.acct +")"+what+"\n\n"+$.strip_tagstemp(toot.status.content),
						icon: toot.account.avatar
					  };
					if(os=="darwin"){
						var n = new Notification('TheDesk:'+domain, options);
					}else{
						ipc.send('native-notf', [
							'TheDesk:'+domain,
							toot.account.display_name+"(" + toot.account.acct +")"+what+"\n\n"+$.strip_tagstemp(toot.status.content),
							toot.account.avatar,
							"toot",
							acct_id,
							toot.status.id
						]);
					}
				}
				if(localStorage.getItem("hasNotfC_" + acct_id)!="true"){
					$(".notf-icon_" + acct_id).addClass("red-text");
				}
				localStorage.setItem("notice-mem", noticetext);
				noticetext = "";
			}
			var if_notf='data-notfIndv="'+acct_id+"_"+toot.id+'"';
			var toot = toot.note;
			var dis_name=escapeHTMLtemp(toot.user.name);
		}else{
			var if_notf="";
			if (toot.renote) {
				var rebtxt = lang.lang_parse_btedsimple;
				var rticon = "fa-retweet light-blue-text";
				var notice = '<i class="big-text fa '+rticon+'"></i>'+ dis_name + "(@" + toot.user.username +
					")<br>";
					var boostback = "shared";
				var uniqueid=toot.id;
				var toot = toot.renote;
				var dis_name=escapeHTMLtemp(toot.user.name);
			    var uniqueid=toot.id;
				var actemojick=false
			} else {
				var uniqueid=toot.id;
				var notice = "";
				var boostback = "";
				//ユーザー強調
				if(toot.user.host){
					var fullname=toot.user.username+"@"+toot.user.host;
				}else{
					var domain = localStorage.getItem("domain_" + acct_id);
					var fullname=toot.user.username+"@"+domain;
				}
				if(useremp){
					Object.keys(useremp).forEach(function(key10) {
					var user = useremp[key10];
					if(user==fullname){
						boostback = "emphasized";
					}
					});
				}
			}
		}
		var id = toot.id;
		if (mix == "home") {
			var home = ""
			var divider = '<div class="divider"></div>';
		} else {
			var home = "";
			var divider = '<div class="divider"></div>';
        }
        /*
		if (toot.account.locked) {
			var locked = ' <i class="fa fa-lock red-text"></i>';
		} else {
			var locked = "";
        }
        */
		if (!toot.app) {
            if(toot.viaMobile){
                var via = '<span style="font-style: italic;">Mobile</span>';
            }else{
                var via = '<span style="font-style: italic;">Unknown</span>';
            }
		} else {
			var via = toot.app.name;
			//強調チェック
			Object.keys(emp).forEach(function(key6) {
				var cli = emp[key6];
				if(cli == via){
					boostback = "emphasized";
				}
			});
			//ミュートチェック
			Object.keys(mute).forEach(function(key7) {
				var cli = mute[key7];
				if(cli == via){
					boostback = "hide";
				}
			});
		}
		if ((toot.cw || toot.cw=="") && cw) {
			var content = toot.text;
			var spoil = escapeHTMLtemp(toot.cw);
			var spoiler = "cw cw_hide_" + toot.id;
			var api_spoil = "gray";
			var spoiler_show = '<a href="#" onclick="cw_show(\'' + toot.id +
				'\')" class="nex parsed">'+lang.lang_parse_cwshow+'</a><br>';
		} else {
			var ct1 =  nl2br(toot.text).split('<br />').length -2;
			var ct2 =  nl2br(toot.text).split('<br>').length -2;
			if(ct1>ct2){ var ct= ct1; }else{ var ct= ct2;  }
			if ((sent < ct && $.mb_strlen($.strip_tagstemp(toot.text)) > 5) || ($.strip_tagstemp(toot.text).length > ltr && $.mb_strlen($.strip_tagstemp(toot.text)) > 5)) {
				var content = '<span class="gray">'+lang.lang_parse_fulltext+'</span><br>' + escapeHTMLtemp(toot.text)
				var spoil = '<span class="cw-long-' + toot.id + '">' + $.mb_substr($.strip_tagstemp(
						toot.text), 0, 100) +
					'</span><span class="gray">'+lang.lang_parse_autofold+'</span>';
				var spoiler = "cw cw_hide_" + toot.id;
				var spoiler_show = '<a href="#" onclick="cw_show(\'' + toot.id +
					'\')" class="nex parsed">'+lang.lang_parse_more+'</a><br>';
			} else {
                var content = escapeHTMLtemp(toot.text);
                if(toot.cw){
                    var spoil = escapeHTMLtemp(toot.cw);
                }else{
                    var spoil="";
                }
				
				var spoiler = "";
				var spoiler_show = "";
			}
		}
		var analyze = '';
		var urls = $.strip_tagstemp(content).replace(/\n/g, " ").match(
			/https?:\/\/([-a-zA-Z0-9@.]+)\/?(?!.*((media|tags)|mentions)).*([-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)?/
		);
		if (urls) {
			var analyze = '<a onclick="additionalIndv(\'' + tlid + '\',' + acct_id +
				',\'' + id + '\')" class="add-show pointer">'+lang.lang_parse_url+'</a><br>';
		} else {
			var analyze = '';
		}
		var viewer = "<br>";
		var hasmedia = "";
		var youtube = "";
		if(toot.emojis){
			var emojick = toot.emojis[0];
		}else{
			var emojick=false;
        }
        //デフォ絵文字
        if(content){
			//MFM
			content=content.replace(/^"([^"]+)"$/gmi, '<blockquote>$1</blockquote>')
			content=content.replace(/`(.+)`/gi, '<code>$1</code>')
			content=content.replace(/(http(s)?:\/\/[\x21-\x7e]+)/gi, '<a href="$1" target="_blank">$1</a>')
			content=content.replace(/\(\(\((.+)\)\)\)/gi, '<span class="shake">$1</span>')
			content=content.replace(/<motion>(.+)<\/motion>/gi, '<span class="shake">$1</span>')
			content=content.replace(/\*\*\*([^*]+)\*\*\*/gi, '<span class="shake" style="font-size:200%">$1</span>')
			content=content.replace(/\*\*([^*]+)\*\*/gi, '<b>$1</b>')
			content=content.replace(/^(.+)\s(検索|search)$/gmi, '<div class="input-field"><i class="material-icons prefix">search</i><input type="text" style="width:calc( 60% - 80px);" name="q" value="$1" id="srcbox_'+toot.id+'"><label for="src" data-trans="src" class="">検索</label><button class="btn waves-effect indigo" style="width:40%;" data-trans-i="src" onclick="goGoogle(\''+toot.id+'\')">検索</button></div>')
			content=content.replace(/\[(.+)\]\(<a href="(http(s)?:\/\/[\x21-\x7e]+)".+\)/gi,'<a href="$2" target="_blank">$1</a>');
			
            content=twemoji.parse(content);
        }else{
            content="";
        }
		
		if(dis_name){
			dis_name=twemoji.parse(dis_name);
		}else{
			dis_name="";
		}
		if(spoil){
			spoil=twemoji.parse(spoil);
		}
		if(noticetext){
			noticetext=twemoji.parse(noticetext);
		}
		if(notice){
			notice=twemoji.parse(notice);
		}
		
		if(toot.files){
			var mediack = toot.files[0];
			var useparam="files";
		}else{
			if(toot.media){
				var mediack = toot.media[0];
				var useparam="media";
			}else{
				var mediack=false;
			}
		}
		//メディアがあれば
		var media_ids="";
		if (mediack) {
			hasmedia = "hasmedia";
			var cwdt = 100 / toot[useparam].length;
			Object.keys(toot[useparam]).forEach(function(key2) {
				var media = toot[useparam][key2];
				var purl = media.url;
				media_ids=media_ids+media.id+",";
				var url = media.url;
				if (media.isSensitive && nsfw) {
					var sense = "sensitive"
				} else {
					var sense = ""
				}
				if(media.type.indexOf("video") !== -1){
					viewer = viewer + '<a onclick="imgv(\'' + id + '\',\'' + key2 + '\',' +
					acct_id + ')" id="' + id + '-image-' + key2 + '" data-url="' + url +
					'" data-type="video" class="img-parsed"><video src="' +
					purl + '" class="' + sense +
					' toot-img pointer" style="max-width:100%;"></a></span>';
				}else{
					viewer = viewer + '<a onclick="imgv(\'' + id + '\',\'' + key2 + '\',' +
					acct_id + ')" id="' + id + '-image-' + key2 + '" data-url="' + url +
					'" data-type="image" class="img-parsed"><img src="' +
					purl + '" class="' + sense +
					' toot-img pointer" style="width:' + cwdt + '%; height:'+imh+'px;"></a></span>';
				}
				
			});
			media_ids = media_ids.slice(0, -1) ;
		} else {
			viewer = "";
			hasmedia = "nomedia";
		}
		var menck = toot.reply;
		var mentions = "";
		//メンションであれば
		if (menck) {
			mentions = '<div style="float:right"><a onclick="udg(\'' + menck.user.id + '\',' +
            acct_id + ')" class="pointer">@' + menck.user.username + '</a></div>';
		}
		var tagck = toot.tags[0];
		var tags = "";
		//タグであれば
		if (tagck) {
			Object.keys(toot.tags).forEach(function(key4) {
				var tag = toot.tags[key4];
				var tags =  '<a onclick="tagShow(\'' + tag + '\')" class="pointer parsed">#' + tag + '</a><span class="hide" data-tag="' + tag + '">#' + tag + ':<a onclick="tl(\'tag\',\'' + tag + '\',' + acct_id +
					',\'add\')" class="pointer parsed" title="' +lang.lang_parse_tagTL.replace("{{tag}}" ,'#'+tag)+ '">TL</a>　<a onclick="brInsert(\'#' + tag + '\')" class="pointer parsed" title="' + lang.lang_parse_tagtoot.replace("{{tag}}" ,'#'+tag) + '">Toot</a>　'+
                    '<a onclick="tagPin(\'' + tag + '\')" class="pointer parsed" title="' +lang.lang_parse_tagpin.replace("{{tag}}" ,'#'+tag)+ '">Pin</a></span> ';
                content=content.replace("#"+tag,tags);
			});
			//tags = '<div style="float:right">' + tags + '</div>';
		}
		//公開範囲を取得
		var vis = "";
		var visen = toot.visibility;
		if (visen == "public") {
			var vis =
				'<i class="text-darken-3 material-icons gray sml vis-data pointer" title="'+lang.lang_parse_public+'('+lang.lang_parse_clickcopy+')" data-vis="public" onclick="staCopy(\''+id+'\')" style="font-size:1rem;">public</i>';
			var can_rt = "";
		} else if (visen == "home") {
			var vis =
				'<i class="text-darken-3 material-icons blue-text vis-data pointer" title="'+lang.lang_misskeyparse_home+'('+lang.lang_parse_clickcopy+')" data-vis="unlisted" onclick="staCopy(\''+id+'\')" style="font-size:1rem;">lock_open</i>';
			var can_rt = "";
		} else if (visen == "followers") {
			var vis =
				'<i class="text-darken-3 material-icons blue-text vis-data pointer" title="'+lang.lang_misskeyparse_followers+'('+lang.lang_parse_clickcopy+')" data-vis="unlisted" onclick="staCopy(\''+id+'\')" style="font-size:1rem;">people</i>';
			var can_rt = "";
		} else if (visen == "private") {
			var vis =
				'<i class="text-darken-3 material-icons orange-text vis-data pointer" title="'+lang.lang_parse_private+'('+lang.lang_parse_clickcopy+')" data-vis="private" onclick="staCopy(\''+id+'\')" style="font-size:1rem;">lock</i>';
			var can_rt = "";
		} else if (visen == "specified") {
			var vis =
				'<i class="text-darken-3 material-icons red-text vis-data pointer" title="'+lang.lang_misskeyparse_specified+'('+lang.lang_parse_clickcopy+')" data-vis="direct" onclick="staCopy(\''+id+'\')" style="font-size:1rem;">mail</i>';
			var can_rt = "hide";
		}
		if (toot.user.username == localStorage.getItem("user_" + acct_id)) {
			var if_mine = "";
			var mine_via="type-b";
		} else {
			var if_mine = "hide";
			var mine_via="";
		}
		if (toot.myReaction) {
			var if_fav = " yellow-text";
			var fav_app = "faved";
		} else {
			var if_fav = "";
			var fav_app = "";
        }
        var if_rt = "";
        var rt_app = "";
        /*
		if (toot.reblogged) {
			var if_rt = "teal-text";
			var rt_app = "rted";
		} else {
			var if_rt = "";
			var rt_app = "";
        }
        */
		//アバター
		var avatar = toot.user.avatarUrl;
		//ワードミュート
		if(wordmute){
			Object.keys(wordmute).forEach(function(key8) {
				var worde = wordmute[key8];
				if(worde){
					if(worde.tag){
						var word=worde.tag;
					}else{
						var word=worde
					}
					var regExp = new RegExp( word, "g" ) ;
					if($.strip_tagstemp(content).match(regExp)){
						boostback = "hide by_filter";
					}
				}
			});
		}
		//ワード強調
		if(wordemp){
			Object.keys(wordemp).forEach(function(key9) {
				var word = wordemp[key9];
				if(word){
					var word=word.tag;
					var regExp = new RegExp( word, "g" ) ;
					content=content.replace(regExp,'<span class="emp">'+word+"</span>");
				}
			});
		}
		//Ticker
		var tickerdom="";
		if(ticker){
			var tickerdata=JSON.parse(localStorage.getItem("ticker"));
			
			var thisdomain=toot.user.username.split("@");
			if(thisdomain.length>1){
				thisdomain=thisdomain[1];
			}
			for( var i=0; i<tickerdata.length; i++) {
				var value=tickerdata[i];
				if(value.domain==thisdomain){
					var tickerdom='<div style="background:linear-gradient(to left,transparent, '+value.bg+' 96%) !important; color:'+value.text+';width:100%; height:0.9rem; font-size:0.8rem;"><img src="'+value.image+'" style="height:100%;"><span style="position:relative; top:-0.2rem;"> '+value.name+'</span></div>';
					break;
				}
		   }
		}
		//Poll
		var poll="";
		if(toot.poll){
			var choices=toot.poll.choices;
			Object.keys(choices).forEach(function(keyc) {
				var choice = choices[keyc];
				if(choice.isVoted){
					var myvote=twemoji.parse("✅");
				}else{
					var myvote="";
				}
				poll=poll+'<div class="pointer vote" onclick="vote(\''+acct_id+'\',\''+toot.id+'\','+choice.id+')">'+choice.text+'('+choice.votes+''+myvote+')</div>';
			});
			poll='<div class="vote_'+toot.id+'">'+poll+'</div>';
		}
        //Reactions
        if(toot.reactionCounts){
        if(toot.reactionCounts.like){
            var like=toot.reactionCounts.like;
            var likehide="";
        }else{
            var like=0;
            var likehide="hide";
        }
        if(toot.reactionCounts.love){
            var love=toot.reactionCounts.love;
            var lovehide="";
        }else{
            var love=0;
            var lovehide="hide";
        }
        if(toot.reactionCounts.laugh){
            var laugh=toot.reactionCounts.laugh;
            var laughhide="";
        }else{
            var laugh=0;
            var laughhide="hide";
        }
        if(toot.reactionCounts.hmm){
            var hmm=toot.reactionCounts.hmm;
            var hmmhide="";
        }else{
            var hmm=0;
            var hmmhide="hide";
        }
        if(toot.reactionCounts.surprise){
            var surprise=toot.reactionCounts.surprise;
            var suphide="";
        }else{
            var suphide="hide";
            var surprise=0;
        }
        if(toot.reactionCounts.congrats){
            var congrats=toot.reactionCounts.congrats;
            var conghide="";
        }else{
            var congrats=0;
            var conghide="hide";
        }
        if(toot.reactionCounts.angry){
            var angry=toot.reactionCounts.angry;
            var anghide="";
        }else{
            var angry=0;
            var anghide="hide";
        }
        if(toot.reactionCounts.confused){
            var confhide="";
            var confused=toot.reactionCounts.confused;
        }else{
            var confused=0;
            var confhide="hide";
        }
        if(toot.reactionCounts.pudding){
            var pudding=toot.reactionCounts.pudding;
            var pudhide="";
        }else{
            var pudding=0;
            var pudhide="hide";
        }
        var fullhide="";
        }else{
            var like=0;var love=0;var laugh=0;var hmm=0;var surprise=0;var congrats=0;var angry=0;var confused=0;var pudding=0;
            var likehide="hide";var lovehide="hide";var laughhide="hide";var hmmhide="hide";var suphide="hide";var conghide="hide";var anghide="hide";var confhide="hide";var pudhide="hide";
            var fullhide="hide";
        }
        if(toot.myReaction){
            var reacted=toot.myReaction;
        }else{
            var reacted="";
        }
		content=nl2br(content);
		if(!content || content==""){
			content='<span class="gray">This post has no content. It may be media-only, private or deleted.</span>';
		}
		var trans="";
		templete = templete + '<div id="pub_' + toot.id + '" class="cvo ' +
			boostback + ' ' + fav_app + ' ' + rt_app + '  ' + hasmedia + '" toot-id="' + id + '" unique-id="' + uniqueid + '" data-medias="'+media_ids+' " unixtime="' + date(obj[
				key].created_at, 'unix') + '" '+if_notf+' onmouseover="mov(\'' + toot.id + '\',\''+tlid+'\',\'mv\')" onclick="mov(\'' + toot.id + '\',\''+tlid+'\',\'cl\')" onmouseout="resetmv(\'mv\')" reacted="'+reacted+'">' +
			'<div class="area-notice"><span class="gray sharesta">' + notice + home +
			'</span></div>' +
			'<div class="area-icon"><a onclick="udg(\'' + toot.user.id +
			'\',' + acct_id + ');" user="' + toot.user.username + '" class="udg">' +
			'<img src="' + avatar +
			'" width="40" class="prof-img" user="' + toot.user.username +
			'"></a></div>' +
			'<div class="area-display_name"><div class="flex-name"><span class="user">' +
			dis_name +
			'</span><span class="sml gray" style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis; cursor:text;"> @' +
			toot.user.username + '</span></div>' +
			'<div class="flex-time"><span class="cbadge cbadge-hover pointer waves-effect" onclick="tootUriCopy(\'https://' +domain+"/notes/"+
			toot.id + '\');" title="' + date(toot.createdAt, 'absolute') +
			'('+lang.lang_parse_clickcopyurl+')"><i class="fa fa-clock-o"></i>' +
			date(toot.createdAt, datetype) + '</span>' +
			'</div></div>' +
			'<div class="area-toot">'+tickerdom+'<span class="toot ' + spoiler + '">' + content +
			'</span><span class="' +
			api_spoil + ' cw_text_' + toot.id + '">' + spoil + spoiler_show +
			'</span>' +
			'' + viewer + '' +
            '</div><div class="area-additional"><span class="additional">'+analyze+
            '<div class="reactions '+fullhide+'" style="height: 25px;"><span class="'+likehide+' reaction re-like"><a onclick="reaction(\'like\',\'' + toot.id + '\',' + acct_id +
            ',\'' + tlid +'\')" class="waves-effect waves-dark btn-flat" style="padding:0;margin-left:3px;">'+twemoji.parse("👍")+'</a><span class="re-likect">'+like+
            '</span></span><span class="'+lovehide+' reaction re-love"><a onclick="reaction(\'love\',\'' + toot.id + '\',' + acct_id +
            ',\'' + tlid +'\')" class="waves-effect waves-dark btn-flat pointer" style="padding:0;margin-left:3px;">'+twemoji.parse("💓")+'</a><span class="re-lovect">'+love+
            '</span></span><span class="'+laughhide+' reaction re-laugh"><a onclick="reaction(\'laugh\',\'' + toot.id + '\',' + acct_id +
            ',\'' + tlid +'\')" class="waves-effect waves-dark btn-flat pointer" style="padding:0;margin-left:3px;">'+twemoji.parse("😁")+'</a><span class="re-laughct">'+laugh+
            '</span></span><span class="'+hmmhide+' reaction re-hmm"><a onclick="reaction(\'hmm\',\'' + toot.id + '\',' + acct_id +
            ',\'' + tlid +'\')" class="waves-effect waves-dark btn-flat pointer" style="padding:0;margin-left:3px;">'+twemoji.parse("🤔")+'</a><span class="re-hmmct">'+hmm+
            '</span></span><span class="'+suphide+' reaction re-surprise"><a onclick="reaction(\'surprise\',\'' + toot.id + '\',' + acct_id +
            ',\'' + tlid +'\')" class="waves-effect waves-dark btn-flat pointer" style="padding:0;margin-left:3px;">'+twemoji.parse("😮")+'</a><span class="re-surprisect">'+surprise+
            '</span></span><span class="'+conghide+' reaction  re-congrats"><a onclick="reaction(\'congrats\',\'' + toot.id + '\',' + acct_id +
            ',\'' + tlid +'\')" class="waves-effect waves-dark btn-flat pointer" style="padding:0;margin-left:3px;">'+twemoji.parse("🎉")+'</a><span class="re-congratsct">'+congrats+
            '</span></span><span class="'+anghide+' reaction re-angry"><a onclick="reaction(\'angry\',\'' + toot.id + '\',' + acct_id +
            ',\'' + tlid +'\')" class="waves-effect waves-dark btn-flat pointer" style="padding:0;margin-left:3px;">'+twemoji.parse("💢")+'</a><span class="re-angryct">'+angry+
            '</span></span><span class="'+confhide+' reaction re-confused"><a onclick="reaction(\'confused\',\'' + toot.id + '\',' + acct_id +
            ',\'' + tlid +'\')" class="waves-effect waves-dark btn-flat pointer" style="padding:0;margin-left:3px;">'+twemoji.parse("😥")+'</a><span class="re-confusedct">'+confused+
            '</span></span><span class="'+pudhide+' reaction re-pudding"><a onclick="reaction(\'pudding\',\'' + toot.id + '\',' + acct_id +
            ',\'' + tlid +'\')" class="waves-effect waves-dark btn-flat pointer" style="padding:0;margin-left:3px;">'+twemoji.parse("🍮")+'</a><span class="re-puddingct">'+pudding+
			'</span></div>'+poll + mentions + tags + '</div>' +
			'<div class="area-vis"></div>'+
			'<div class="area-actions '+mouseover+'">' +
			'<div class="action">'+vis+'</div>'+
			'<div class="action '+antinoauth+'"><a onclick="detEx(\'https://misskey.xyz/notes/'+toot.id+'\',\'main\')" class="waves-effect waves-dark details" style="padding:0">'+lang.lang_parse_det+'</a></div>' +
			'<div class="action '+disp["re"]+' '+noauth+'"><a onclick="misskeyreply(\'' + toot.id +
			'\',\'' + acct_id + '\',' +
			acct_id + ',\''+visen+
			'\')" class="waves-effect waves-dark btn-flat" style="padding:0" title="'+lang.lang_parse_replyto+'"><i class="fa fa-share"></i></a></div>' +
			'<div class="action '+can_rt+' '+disp["rt"]+' '+noauth+'"><a onclick="renote(\'' + toot.id + '\',' + acct_id +
			',\'' + tlid +
			'\')" class="waves-effect waves-dark btn-flat" style="padding:0" title="'+lang.lang_misskeyparse_renote+'"><i class="text-darken-3 fa fa-retweet ' +
			if_rt + ' rt_' + toot.id + '"></i><span class="rt_ct"></span></a></div>' +
			'<div class="action '+can_rt+' '+disp["qt"]+' '+noauth+'"><a onclick="renoteqt(\'' + toot.id + '\',' + acct_id +
			',\'misskey.xyz\',\'misskey.xyz\')" class="waves-effect waves-dark btn-flat" style="padding:0" title="'+lang.lang_misskeyparse_renoteqt+'"><i class="text-darken-3 fa fa-quote-right"></i></a></div>' +
			'<div class="action '+disp["fav"]+' '+noauth+'"><a onclick="reactiontoggle(\'' + toot.id + '\',' + acct_id +
			',\'' + tlid +
			'\')" class="waves-effect waves-dark btn-flat" style="padding:0" title="'+lang.lang_misskeyparse_reaction+'"><i class="fa text-darken-3 fa-plus' +
			if_fav + ' fav_' + toot.id + '"></i></div>' +
			'<div class="' + if_mine + ' action '+disp["del"]+' '+noauth+'"><a onclick="del(\'' + toot.id + '\',' +
			acct_id +
			')" class="waves-effect waves-dark btn-flat" style="padding:0" title="'+lang.lang_parse_del+'"><i class="fa fa-trash-o"></i></a></div>' +
			'<div class="' + if_mine + ' action pin '+disp["pin"]+' '+noauth+'"><a onclick="pin(\'' + toot.id + '\',' +
			acct_id +
			')" class="waves-effect waves-dark btn-flat" style="padding:0" title="'+lang.lang_parse_pin+'"><i class="fa fa-map-pin pin_' + toot.id + '"></i></a></div>' 
			+'<div class="' + if_mine + ' action '+disp["red"]+' '+noauth+'"><a onclick="redraft(\'' + toot.id + '\',' +
			acct_id +
			')" class="waves-effect waves-dark btn-flat" style="padding:0" title="'+lang.lang_parse_redraft+'"><i class="material-icons">redo</i></a></div>'+trans+
			'<span class="cbadge viabadge waves-effect '+viashow+' '+mine_via+'" onclick="client(\''+$.strip_tagstemp(via)+'\')" title="via ' + $.strip_tagstemp(via) + '">via ' +
			via +
			'</span>'+
			'</div><div class="area-side '+mouseover+'"><div class="action ' + if_mine + ' '+noauth+'"><a onclick="toggleAction(\'' + toot.id + '\',\''+tlid+'\',\''+acct_id+'\')" class="waves-effect waves-dark btn-flat" style="padding:0"><i class="text-darken-3 material-icons act-icon">expand_more</i></a></div>' +
			'<div class="action '+noauth+'"><a onclick="details(\'' + toot.id + '\',' + acct_id +
			',\''+tlid+'\')" class="waves-effect waves-dark btn-flat details" style="padding:0"><i class="text-darken-3 material-icons">more_vert</i></a></div>' +
			'</div></div>' +
			'</div></div>';
	});
	return templete;
}

//オブジェクトパーサー(ユーザーデータ)
function misskeyUserparse(obj, auth, acct_id, tlid, popup) {
	if(popup > 0 || popup==-1){
		
	}else{
		var obj = obj.users;
	}
	var templete = '';
	var datetype = localStorage.getItem("datetype");
	Object.keys(obj).forEach(function(key) {
		var toot = obj[key];
		var locked = "";
		if (auth) {
			var auth = '<i class="material-icons gray pointer" onclick="misskeyRequest(\'' +
				toot.id + '\',\'accept\',' + acct_id + ')">person_add</i>';
		} else {
			var auth = "";
		}
		var ftxt=lang.lang_parse_followed;
		if(popup > 0 || popup==-1){
			var notftext='<span class="cbadge"title="' + date(toot.createdAt,
				'absolute') + '('+lang.lang_parse_notftime+')"><i class="fa fa-clock-o"></i>' + date(toot.createdAt,
				datetype) +
			'</span>'+ftxt+'<br>';
			var toot = toot.user;
		}else{
			var notftext="";
		}
		var memory = localStorage.getItem("notice-mem");
			if (popup >= 0 && obj.length < 5 && notftext != memory) {
				Materialize.toast(escapeHTMLtemp(toot.name)+":"+ftxt, popup * 1000);
				$(".notf-icon_" + tlid).addClass("red-text");
				localStorage.setItem("notice-mem", notftext);
				notftext = "";
				var native=localStorage.getItem("nativenotf");
				if(!native){
					native="yes";
				}
				if(native=="yes"){
					var electron = require("electron");
					var ipc = electron.ipcRenderer;
					var os = electron.remote.process.platform;
					var options = {
						body: toot.display_name+"(" + toot.acct +")"+ftxt,
						icon: toot.avatar
					  };
					  var domain = localStorage.getItem("domain_" + acct_id);
					if(os=="darwin"){
						var n = new Notification('TheDesk:'+domain, options);
					}else{
						ipc.send('native-notf', [
							'TheDesk:'+domain,
							toot.display_name+"(" + toot.acct +")"+ftxt,
							toot.avatar,
							"userdata",
							acct_id,
							toot.id
						]);
					}
				}
			}
			if(toot.name){
				var dis_name=escapeHTMLtemp(toot.name);
				dis_name=twemoji.parse(dis_name);
			}else{
				var dis_name=toot.name;
			}
		templete = templete +
			'<div class="cvo" style="padding-top:5px;" user-id="' + toot.id + '"><div class="area-notice">' +
			notftext +
			'</div><div class="area-icon"><a onclick="udg(\'' + toot.id + '\',' +
			acct_id + ');" user="' + toot.username + '" class="udg">' +
			'<img src="' + toot.avatarUrl + '" width="40" class="prof-img" user="' + toot
			.username + '"></a></div>' +
			'<div class="area-display_name"><div class="flex-name"><span class="user">' +
			dis_name + '</span>' +
			'<span class="sml gray" style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;user-select:auto; cursor:text;"> @' +
			toot.username + auth +'</span>' +
			'</div>' +
			'</div>' +
			'<div style="justify-content:space-around" class="area-toot"> <div class="cbadge" style="width:100px;">Follows:' +
			toot.followingCount +
			'</div><div class="cbadge" style="width:100px;">Followers:' + toot.followersCount +
			'</div>' +
			'</div>' +
			'</div>' +
			'</div>';

	});
	return templete;
}
function goGoogle(id){
	var val=$("#srcbox_"+id).val();
	var url="https://google.com/search?q="+val;
	const {
		shell
	} = require('electron');

	shell.openExternal(url);
}