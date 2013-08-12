chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
	var activity = message.activity;
	if (activity) {
		GplusPost(activity);
	}
	sendResponse({});
});

function GplusPost(_message){
	//SendIdとUserIdの取得
	var ajax1 = new XMLHttpRequest();
	ajax1.onreadystatechange = function() {
		if (ajax1.readyState == 4 && ajax1.status == 200){
			if(ajax1.responseText.match(/\"(AObGSA.*:\d*)\"/)){
				var sendid = RegExp.$1;					//SendIdの取得
				ajax1.responseText.match(/OZ_initData[ ]?=[ ]?\{\"2\":\[\"(\d*)\"/);
				var userid = RegExp.$1;					//UserIdの取得

				//Google+に一般投稿をする
				var ajax2 = new XMLHttpRequest();
				ajax2.onreadystatechange = function() {
					if (ajax2.readyState == 4 && ajax2.status == 200) {
					}
				};
				//重複を防ぐためのカウント
				var gSeq = 0;
				//文字列のエンコード
				var encStr = function(s){
					return escape(s).replace(/%/g, '');
				}
			   
				//投稿対象になるエリア
				var scopeData = {
					aclEntries: [{
						scope: {
							scopeType: 'anyone',
							name: encStr('全員'),
							id: 'anyone',
							me: true,
							requiresKey: false
						},
						role: 20
					},
					{
						scope: {
							scopeType: 'anyone',
							name: encStr('全員'),
							id: 'anyone',
							me: true,
							requiresKey: false
						},
						role: 60
					}]
				};

				//投稿内容
				var spar = [
					encodeURIComponent(_message),
					'oz:' + userid + '.' + new Date().getTime().toString(16) + '.' + (function(){return gSeq++})(),
					null,
					null,
					null,
					null,
					'[]',
					null,
					JSON.stringify(scopeData),
					true,
					[],
					false,
					false,
					null,
					[],
					false,
					false
				];

				ajax2.open('POST', "https://plus.google.com/_/sharebox/post/?spam=20&_reqid="+(function(){
					//_reqidは7桁のランダム数
					var a = String(Math.floor(Math.random(9999999)*1000000));
					while(a.length<7){
							a = "0"+a;
					}
					return a;
				})()+"&rt=j", true);

				//投稿用ヘッダの設定
				ajax2.setRequestHeader('X-Same-Domain', '1');
				ajax2.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
				ajax2.setRequestHeader('Pragma', 'no-cache');
				ajax2.setRequestHeader('Cache-Control', 'no-cache');

				//ポスト
				ajax2.send("spar="+JSON.stringify(spar)+"&at="+sendid);
			}
		}
	};
	ajax1.open('GET', "https://plus.google.com/", true);
	ajax1.send();
};
