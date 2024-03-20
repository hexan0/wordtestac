//LINEとやりとりするための関数を集めたファイル

//LINEのアクセストークン
var channel_access_token = "6dS4haNDiCRssA/ymC4KKl3BCJKNf5W1oM2GkGEU7qe/DALKx9BOhlbtvpAfog4HmJ2FIouplPK91yYV/0JCvtRaI1GujF/pBWkAXw8zmoneoHMk1YuNdmEy74RAEDll5qHLqlRSbWP+Gsrrrro2LwdB04t89/1O/w1cDnyilFU=";
var headers = {
   "Content-Type": "application/json; charset=UTF-8",
   "Authorization": "Bearer " + channel_access_token
};

function sendLineMessageFromReplyToken(token, replyText) {
 var url = "https://api.line.me/v2/bot/message/reply";
 var headers = {
   "Content-Type": "application/json; charset=UTF-8",
   "Authorization": "Bearer " + channel_access_token
 };
 var postData = {
   "replyToken": token,
   "messages": [{
     "type": "text",
     "text": replyText
   }]
 };
 var options = {
   "method": "POST",
   "headers": headers,
   "payload": JSON.stringify(postData)
 };
 return UrlFetchApp.fetch(url, options);
}

//2メッセージ
function sendLineMessageFromReplyToken2(token, replyText1, replyText2) {
 var url = "https://api.line.me/v2/bot/message/reply";
 var headers = {
   "Content-Type": "application/json; charset=UTF-8",
   "Authorization": "Bearer " + channel_access_token
 };
 var postData = {
   "replyToken": token,
   "messages": [{
     "type": "text",
     "text": replyText1
   },{
     "type": "text",
     "text": replyText2
   }]
 };
 var options = {
   "method": "POST",
   "headers": headers,
   "payload": JSON.stringify(postData)
 };
 return UrlFetchApp.fetch(url, options);
}

//QuickReply
function sendLineQuickReplyFromReplyToken(token, replyText1, replyText2, s) {
 var url = "https://api.line.me/v2/bot/message/reply";
 var headers = {
   "Content-Type": "application/json; charset=UTF-8",
   "Authorization": "Bearer " + channel_access_token
 };
 var postData = {
   "replyToken": token,
   "messages": [{
     "type": "text",
     "text": replyText1
   },{
     "type": "text",
     "text": replyText2
   },{
     "type": "text",
     "text": "[1]. "+s[0]+"\n[2]. "+s[1]+"\n[3]. "+s[2]+"\n[4]. "+s[3],
     "quickReply": {
		"items": [
			{
				"type": "action",
					"action": {
						"type": "message",
						"label": "[1]",
						"text": s[0]
					}
			},{
				"type": "action",
					"action": {
						"type": "message",
						"label": "[2]",
						"text": s[1]
					}
			},{
				"type": "action",
					"action": {
						"type": "message",
						"label": "[3]",
						"text": s[2]
					}
			},{
				"type": "action",
					"action": {
						"type": "message",
						"label": "[4]",
						"text": s[3]
					}
			}
		]
	}
   }]
 };
 var options = {
   "method": "POST",
   "headers": headers,
   "payload": JSON.stringify(postData)
 };
 return UrlFetchApp.fetch(url, options);
}

//pushAPIを用いる(制限あり)
function sendLineMessageFromUserId(userId, text) {
 var url = "https://api.line.me/v2/bot/message/push";
 var postData = {
   "to": userId,
   "messages": [{
     "type": "text",
     "text": text
   }]
 };
 var options = {
   "method": "POST",
   "headers": headers,
   "payload": JSON.stringify(postData)
 };
 return UrlFetchApp.fetch(url, options);
}

// Get profile of LINE
function get_line_profile(line) {//lineはwebHookData
  var headers = {
    "Content-Type": "application/json; charset=UTF-8",
    "Authorization": "Bearer " + channel_access_token
  };
  var options = {
    'headers': headers
  };
  var url;
  switch (line.source.type) {
    case 'user':
      url = 'https://api.line.me/v2/bot/profile/' + line.source.userId;
      break;
    case 'group':
      url = 'https://api.line.me/v2/bot/group/' + line.source.groupId + '/member/' + line.source.userId;
      break;
    case 'room':
      url = 'https://api.line.me/v2/bot/room/' + line.source.groupId + '/member/' + line.source.userId;
      break;
  }
  var response = UrlFetchApp.fetch(url, options);
  var content = JSON.parse(response.getContentText());
  return content; 
}