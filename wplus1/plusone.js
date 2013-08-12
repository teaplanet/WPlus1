$(function(){

	/*
		投稿に関する設定はここで行う。
		"投稿するメッセージ" と "投稿後にWordPressに表示するメッセージ" を返す必要がある。
		return [msg, done]
	 */
	function setting() {
		// URL
		var url = $("p a", msgArea).attr("href");

		// 記事のタイトル
		var title = $("#title").attr("value");
		
		// 以上は使わなくてもよい。

		/*
			msgは投稿に必要なので必ず設定する。
			doneは利便性のために表示するだけなので、なくてもよい。
		 */
		var msg = title + " " + url;
		var done = '<p><a href="https://plus.google.com/">Google+</a>に投稿しました。</p>';
		return [msg, done];
	}


// ======================================================
// 以下は触れる必要がない。
// ======================================================
	var msgArea = $("#message");
	if (msgArea.length != 0) {
		var info = setting();
		postGPlus(info[0], info[1]);
	}

	/*
		Google+に投稿する。
		msg: 投稿するメッセージ
		done: 投稿後にWordPressの管理画面に表示するメッセージ
	 */	
	function postGPlus(msg, done) {
		var message = {activity: msg};
		chrome.extension.sendMessage(message, function(res){
			if (done) {
				msgArea.append(done);
			}
		});
	}

});
