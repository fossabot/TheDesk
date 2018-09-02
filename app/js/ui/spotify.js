function spotifyConnect(){
    var auth = "https://accounts.spotify.com/authorize?client_id=0f18e54abe0b4aedb4591e353d3aff69&redirect_uri=https://thedesk.top/spotify-connect&response_type=code&scope=user-read-currently-playing";
		const {
  			shell
  		} = require('electron');

		  
          var electron = require("electron");
          var remote=electron.remote;
          var platform=remote.process.platform;
	    if(platform=="win32"){
            //Only for WinStore
            auth=auth+"&state=code";
            $("#spotify-code-show").removeClass("hide");
            shell.openExternal(auth);
        }else{
            auth=auth+"&state=code";
            $("#spotify-code-show").removeClass("hide");
            shell.openExternal(auth);
        }
        
		  
}
function spotifyAuth(){
    var code=$("#spotify-code").val();
    localStorage.setItem("spotify", "code");
    localStorage.setItem("spotify-refresh", code);
    $("#spotify-code-show").addClass("hide");
    $("#spotify-enable").addClass("disabled");
    $("#spotify-disable").removeClass("disabled");
}
function spotifyDisconnect(){
    localStorage.removeItem("spotify");
    localStorage.removeItem("spotify-refresh");
    checkSpotify();
}
function checkSpotify(){
    if(localStorage.getItem("spotify")){
        $("#spotify-enable").addClass("disabled");
        $("#spotify-disable").removeClass("disabled");
    }else{
        $("#spotify-enable").removeClass("disabled");
        $("#spotify-disable").addClass("disabled");
    }
    var content=localStorage.getItem("np-temp");
    if(!content || content=="" || content=="null"){
        var content="#NowPlaying {song} / {album} / {artist}\n{url} #SpotifyWithTheDesk";
    }
    $("#np-temp").val(content);
    var flag=localStorage.getItem("artwork");
    if(flag){
        $("#awk_yes").prop("checked", true);
    }else{
        $("#awk_no").prop("checked", true);
    }
}
function spotifyFlagSave(){
    var awk = $("[name=awk]:checked").val();
    if(awk=="yes"){
        localStorage.setItem("artwork","yes");
        Materialize.toast(lang_spotify_img[lang], 3000);
    }else{
        localStorage.removeItem("artwork");
        Materialize.toast(lang_spotify_imgno[lang], 3000);
    }
}
function nowplaying(mode){
    if(mode=="spotify"){
        var start = "https://thedesk.top/now-playing?at="+localStorage.getItem("spotify")+"&rt="+localStorage.getItem("spotify-refresh");
        var at = localStorage.getItem("spotify");
        if(at){
        fetch(start, {
            method: 'GET',
            headers: {
                'content-type': 'application/json'
            }
        }).then(function(response) {
            return response.json();
        }).catch(function(error) {
            todo(error);
            console.error(error);
        }).then(function(json) {
            console.log(json);
            if(json.length<1){
                return false;
            }
            var item=json.item;
            var img=item.album.images[0].url;
            var electron = require("electron");
             var ipc = electron.ipcRenderer;
             var flag=localStorage.getItem("artwork");
            if(flag){
                ipc.send('bmp-image', [img,0]);
            }
            var content=localStorage.getItem("np-temp");
            if(!content || content=="" || content=="null"){
                var content="#NowPlaying {song} / {album} / {artist}\n{url}";
            }
            var regExp = new RegExp("{song}", "g");
            content = content.replace(regExp, item.name);
            var regExp = new RegExp("{album}", "g");
            content = content.replace(regExp, item.album.name);
            var regExp = new RegExp("{artist}", "g");
            content = content.replace(regExp, item.artists[0].name);
            var regExp = new RegExp("{url}", "g");
            content = content.replace(regExp, item.external_urls.spotify);
            var regExp = new RegExp("{composer}", "g");
            content = content.replace(regExp, "");
            var regExp = new RegExp("{hz}", "g");
            content = content.replace(regExp, "");
            var regExp = new RegExp("{bitRate}", "g");
            content = content.replace(regExp, "");
            var regExp = new RegExp("{lyricist}", "g");
            content = content.replace(regExp, "");
            var regExp = new RegExp("{bpm}", "g");
            content = content.replace(regExp, "");
            var regExp = new RegExp("{genre}", "g");
            content = content.replace(regExp, "");
            $("#textarea").val(content);
        });
        }else{
            alert(lang_spotify_acct[lang]);
        }
    }else if(mode=="itunes"){
        var electron = require("electron");
	    var ipc = electron.ipcRenderer;
	    ipc.send('itunes', "");
	    ipc.on('itunes-np', function (event, arg) {
            console.log(arg);
            var content=localStorage.getItem("np-temp");
            if(!content || content=="" || content=="null"){
                var content="#NowPlaying {song} / {album} / {artist}\n{url}";
            }
            var regExp = new RegExp("{song}", "g");
            content = content.replace(regExp, arg.name);
            var regExp = new RegExp("{album}", "g");
            content = content.replace(regExp, arg.album);
            var regExp = new RegExp("{artist}", "g");
            content = content.replace(regExp, arg.artist);
            var regExp = new RegExp("{url}", "g");
            content = content.replace(regExp, "");
            var regExp = new RegExp("{composer}", "g");
            content = content.replace(regExp, arg.composer);
            var regExp = new RegExp("{hz}", "g");
            var regExp = new RegExp("{lyricist}", "g");
            content = content.replace(regExp, "");
            var regExp = new RegExp("{bpm}", "g");
            content = content.replace(regExp, "");
            content = content.replace(regExp, arg.sampleRate/1000+"kHz");
            var regExp = new RegExp("{bitRate}", "g");
            content = content.replace(regExp, arg.bitRate+"kbps");
            var regExp = new RegExp("{genre}", "g");
            content = content.replace(regExp, arg.genre);
            $("#textarea").val(content);
	    })
    }
    
}
function spotifySave(){
    var temp=$("#np-temp").val();
    localStorage.setItem("np-temp", temp);
    Materialize.toast(lang_spotify_np[lang], 3000);
}
if(location.search){
    var m = location.search.match(/\?mode=([a-zA-Z-0-9]+)\&code=(.+)/);
    var mode=m[1];
    var codex=m[2];
    if(mode=="spotify"){
        var coder=codex.split(":");
        localStorage.setItem("spotify", coder[0]);
        localStorage.setItem("spotify-refresh", coder[1]);
    }else{
        
    }
    
}
$("#npbtn").click(function() {
    nowplaying('spotify');
});
$("#npbtn").bind('contextmenu', function() {
    nowplaying('itunes');
    return false;
});
/*cinderella NP*/
function cgNP(q){
    suggest = "https://cg.toot.app/api/v1/?song=" + q
		console.log(suggest)
		fetch(suggest, {
			method: 'GET',
			headers: {
				'content-type': 'application/json'
			},
		}).then(function(response) {
			return response.json();
		}).catch(function(error) {
			todo(error);
			console.error(error);
		}).then(function(json) {
			console.log(json);
			var electron = require("electron");
            var ipc = electron.ipcRenderer;
            var flag=localStorage.getItem("artwork");
            if(flag){
                  var img=json.album.artwork;
                ipc.send('bmp-image', [img,0]);
             }
            var content=localStorage.getItem("np-temp");
             if(!content || content==""){
                   var content="#NowPlaying {song} / {album} / {artist}\n{url}";
             }
            var regExp = new RegExp("{song}", "g");
            content = content.replace(regExp, json.name);
            var regExp = new RegExp("{album}", "g");
            content = content.replace(regExp, json.album.name);
            var regExp = new RegExp("{artist}", "g");
            content = content.replace(regExp, json.artist.text);
            var regExp = new RegExp("{composer}", "g");
            content = content.replace(regExp, json.composer);
            var regExp = new RegExp("{lyricist}", "g");
            content = content.replace(regExp, json.lyricist);
            var regExp = new RegExp("{bpm}", "g");
            content = content.replace(regExp, json.bpm);
            var regExp = new RegExp("{genre}", "g");
            content = content.replace(regExp, "");
            var regExp = new RegExp("{url}", "g");
            content = content.replace(regExp, "");
            $("#textarea").val(content);
				});
}