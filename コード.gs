// GASが呼び出されたときに実行。HTMLを表示する
function doGet(e) {
  var app = HtmlService.createHtmlOutputFromFile("index")
  return app;
}

/*
正解率×出題回数が最も低いものから出題→？？？


*/


//line上で何か送られてきたとき実行される
function doPost(e) {
  var webhookData = JSON.parse(e.postData.contents).events[0];
  var sheetOpen = 
    SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1OfwZqFLWpsVEB9IFHdt1qvIkiUJBTJ1P44vyt7KvjN4/');
  var sheetServerData = sheetOpen.getSheetByName('ServerData');
  var replyText=sheetServerData.getRange("B3").getValue();
  if(sheetServerData.getRange("B2").getValue()){
    return doPost_active(e);
  }else{
    return sendLineMessageFromReplyToken(webhookData.replyToken, replyText);
  }
}

//メンテナンスじゃないとき
function doPost_active(e){
 const HowToUse = "<使い方>\n"+
                  "#使い方　-今君が読んでいる使い方を表示するよ\n"+
                  "#開始　-内容と方法、範囲を指定してテストを行うよ\n"+
                  "#スコア　-自分のスコアを表示するよ\n"+
                  "#ランキング　-自分がランキング内で何位か分かるよ\n"+
                  "#週間ランキング　-一週間の増加pのランキングが分かるよ\n"+
                  "#名前登録　-ランキングのユーザーidが今のLINEの名前に変わるよ\n"+
                  "#名前登録解除　-ランキングの名前をユーザーidに戻すよ\n"+
                  "#追加　-編集が許可されている単語帳に自分の追加したい単語を追加できます\n"+
                  "#終了　-はい、おしまーい";
 const WhatContents = "現在学習可能なのは\n"+
                      "英単語　-一般的な英単語(大学教養レベル)\n"+
                      "試験英語　-テストレベルの英単語\n"+
                      "中国語　-\n"+
                      "　-\n"+
                      "　-\n"+
                      " -\n"+
                      "パス単〇級　-〇に級を入れてね(準1/2/3/4のみ実装済、1/準2/5は未実装)\n"+
                      "　-\n"+
                      "その他隠しコマンドもあります";                
 const WhatWay = "現在使用可能な学習方法は\n"+
                 "1.回答入力式(実装済)\n"+
                 "2.回答選択式(実装済)\n"+
                 "3.説明選択式(実装済)\n"+
                 "7.順番回答選択式(未実装)\n"+
                 "8.順番説明選択式(未実装)\n"+
                 "11.単語一覧表示(実装済)\n"+
                 "(文頭の数字で方法指定してね！)";
 const UserDataCol ={
                       UserId:"A",
                       DisplayName:"B",
                       Score:"C",
                       Status:"D",
                       Content:"E",
                       Way:"F",
                       From:"G",
                       To:"H",
                       QNum:"I",
                       Answer:"J",
                       Weak:"K",
                       Developer:"L"
                    };
 const ContentName = {
                       1:"英単語",
                       2:"英単語2",
                       3:"英単語3",
                       4:"英単語4",
                       5:"英単語5",
                       6:"ドイツ語",
                       7:"中国語",
                       8:"ロシア語",
                       9:"スペイン語",
                       11:"パス単1級",
                       21:"パス単準1級",
                       12:"パス単2級",
                       22:"パス単準2級",
                       13:"パス単3級",
                       14:"パス単4級",
                       15:"パス単5級"
                     };
 var webhookData = JSON.parse(e.postData.contents).events[0];
 var message, replyToken, userId, profile, userName;
 //var replyText = new Array();
 var replyText1 = "";
 var replyText2 = "";
 var replySelect = [];
 /*message = "#開始";
 replyToken = "a";
 userId= "a";*/
 message = webhookData.message.text;
 replyToken = webhookData.replyToken;
 userId = webhookData.source.userId;
 userName = get_line_profile(webhookData).displayName;
 //profile = line_bot_api.get_profile(userId);
 //userName = profile.display_name;
 var status = readUserData(userId,UserDataCol.Status);
  /*0待機状態、1内容指定待ち、2方式指定、3範囲指定始点、4範囲指定終点、9回答待ち
  11編集content指定、12
  */
 var content = readUserData(userId,UserDataCol.Content);
  /*0待機状態、1英単語、23DUO文、単語、4共通英語(コミュ英単語)、5CuttingEdge,
  */
 var contents = ContentName[content];//コンテンツの名前が入る
 
 var way = readUserData(userId,UserDataCol.Way);
 var min = readUserData(userId,UserDataCol.From);
 var max = readUserData(userId,UserDataCol.To);
 
 var permission = readUserData(userId,UserDataCol.Developer);
 
 
 if(message.substr(0,1)=='#'){
   message = message.substr(1);
   var command = message.split(' ');
   switch (command[0]) {
     case "使い方":
     case "howtouse":
     case "htu":
       replyText1 = HowToUse;
       break;
     case "開始":
     case "start":
     case "s":
       replyText1 = "それでは始めましょう！\nまずは内容を指定して？";
       writeUserData(userId,UserDataCol.Status,"1");//status
       replyText2 = WhatContents;
       break;
     case "スコア":
     case "score":
       replyText1 = "あなたのスコアは"+readUserData(userId,UserDataCol.Score)+"です";
       break;
     case "ランキング":
     case "ranking":
     case "r":
       replyText1 = ranking(userId);
       break;
     case "dr":
       if(permission){//ここに権限があるかないかを検知するものを入れる
         replyText1 = dRanking();
       }else{
         replyText1 = "権限がないみたい(´・ω・｀)";
       }
       break;
     case "週間ランキング":
     case "weeklyranking":
     case "wr":
       replyText1 = wRanking(userId);
       break;
     case "名前登録":
     case "register":
       writeUserData(userId,UserDataCol.DisplayName,userName);
       replyText1 = "あなたの名前「"+userName+"」を登録しました！\nこれからもよろしくね！";
       break;
     case "名前登録解除":
         writeUserData(userId,UserDataCol.DisplayName,"");
       replyText1 = "あなたの名前の情報はちゃんとシュレッダーにかけられました";
       break;
     case "追加":
     case "add":
       if(permission){//ここに権限があるかないかを検知するものを入れる
         writeUserData(userId,UserDataCol.Status,"11");//status
         replyText1 = "単語を追加するよ\n内容を指定してくださいな";
       }else{
         replyText1 = "権限がないみたい(´・ω・｀)";
       }
       break;
     case "終了":
     case "end":
     case "e":
       replyText1 = "ちなみに↑の問題の答えは"+readUserData(userId,UserDataCol.Answer);
       replyText2 = "終了します\nお疲れ様～";
       writeUserData(userId,UserDataCol.Status,"0");//status
       writeUserData(userId,UserDataCol.Content,"0");//content
       writeUserData(userId,UserDataCol.Way,"0");//way
       writeUserData(userId,UserDataCol.From,"0");//from
       writeUserData(userId,UserDataCol.To,"0");//to
       way = 1;
       break;
     default:
       replyText1 = "#の後ろに正しい文字が入力されていません。正しくは使い方を参照してください。\n(コマンドミスを検知)\n"+HowToUse;
   }
 }else{//最初が#ではない場合、回答or設定or妄言
   switch (status) {
     case 0://待機中の妄言
       //replyText1 = "は？";
       break;
     case 1://内容指定
       switch(message){
         case "英単語":
         case "at":
         case "et":
           writeUserData(userId,UserDataCol.Content,"1");//content
           break;
         case "仮":
         case "仮":
         case "仮":
           writeUserData(userId,UserDataCol.Content,"2");//content
           writeUserData(userId,UserDataCol.Way,"1");//方法
           break;
         case "中国語":
         case "ch":
         case "中":
           writeUserData(userId,UserDataCol.Content,"7");//content
           break;
         
         default:
           replyText1 = "そんなものは無かった、いいね？";
       }
       switch(readUserData(userId,UserDataCol.Content)){
         case 1:
         case 3:
         case 4:
         case 5:
         case 6:
         case 7:
         case 8:
         case 9:
         case 11:
         case 12:
         case 13:
         case 14:
         case 15:
         case 21:
         case 22:
           writeUserData(userId,UserDataCol.Status,"2");
           replyText1 = "学びたい方式を選択してね";
           replyText2 = WhatWay;
           break;
         case 2:
           writeUserData(userId,UserDataCol.Status,"3");
           replyText1 = "学びたい範囲の最初の問題番号を教えてね\n※0を指定すると最初から出題するよ！";
           break;
         default:
           replyText1 = "error!\ncontentの値が異常値です\n一旦 #終了 してもう一度お試しください";
       }
       break;
     case 2://方式指定
       switch(parseInt(message)){
         case 1:
         case 2:
         case 3:
         case 11:
           writeUserData(userId,UserDataCol.Status,"3");//status
           writeUserData(userId,UserDataCol.Way,message);//方法
           replyText1 = "学びたい範囲の最初の問題番号を教えてね\n※0を指定すると最初から出題するよ！";
           break;
         default:
         replyText1 = "その学習方法はまだ実装されていないか存在しないよ";
       }
       break;
     case 3://始点指定
       writeUserData(userId,UserDataCol.Status,"4");//status
       writeUserData(userId,UserDataCol.From,message);//始点
       replyText1 = "学びたい範囲の最後の問題番号を教えてね\n※0を指定すると最後まで出題するよ！";
       break;
     case 4://終点指定
       writeUserData(userId,UserDataCol.To,message);//終点
       max=parseInt(message);
       if(content==2){
         writeUserData(userId,UserDataCol.Status,"9");//status
         status = 9;
         replyText1 = min+"から"+max+"までを回答完全一致式で"+contents+"はじめるよ〜";
         replyText2 = new_duo_quiz(userId,min,max);
       }else{
         switch(way){
           case 1:
             writeUserData(userId,UserDataCol.Status,"9");//status
             status = 9;
             replyText1 = min+"から"+max+"までを回答完全一致式で"+contents+"はじめるよ〜";
             replySelect = new_quiz_line(userId,contents,min,max,way);
             replyText2 = replySelect[0];
             break;
           case 2:
             writeUserData(userId,UserDataCol.Status,"9");//status
             status = 9;
             replyText1 = min+"から"+max+"までを回答選択式で"+contents+"はじめるよ〜";
             replySelect = new_quiz_line(userId,contents,min,max,way);
             replyText2 = replySelect[0];
             break;
           case 3:
             writeUserData(userId,UserDataCol.Status,"9");//status
             status = 9;
             replyText1 = min+"から"+max+"までを説明選択式で"+contents+"はじめるよ〜";
             replySelect = new_quiz_line(userId,contents,min,max,way);
             replyText2 = replySelect[0];
             break;
           case 11:
             writeUserData(userId,UserDataCol.Status,"0");//status
             status = 0;
             replyText1 = min+"から"+max+"まで"+contents+"の一覧を表示するよ〜";
             replyText2 = list(contents,min,max);
             break;
           default:
             replyText1 = "回答方式について予期せぬエラーが発生しました\n#終了 で最初からやりなおしてください";
         }
       }
       break;
     case 9:
       var quiz_ans = readUserData(userId,UserDataCol.Answer);
       if(message.substr(-1)==" "){
         message = message.slice(0,-1);
       }
       if(message==quiz_ans){
         replyText1 = "◎正解！\n正解は"+quiz_ans;
         getPoint(userId,contents,readUserData(userId,UserDataCol.QNum));
       }else{
         replyText1 = "×違う！\n正解は"+quiz_ans;
       }
       if(content==2){
         switch(way){
           case 1:
             replyText2 = new_duo_quiz(userId,min,max);
             break;
         }
       }else{
         replySelect = new_quiz_line(userId,contents,min,max,way);
         replyText2 = replySelect[0];
         
       }
       break;
       
     case 11://編集内容指定
       switch(message){
         case "英単語":
         case "共通英語":
         case "講習":
           writeUserData(userId,UserDataCol.Status,"12");//status
           writeUserData(userId,userId,UserDataCol.Content,"1");//content
           contents = message;
           replyText1 = message+"に追加するよ";
           replyText2 = "識別番号？\n通し番号があればそれを入力、なければ半角スペース";
           break;
         case "DUO":
         case "DUO単語":
         case "ターゲット":
         case "1900":
         case "330":
         case "パス単1級":
         case "パス単準1級":
         case "パス単2級":
         case "パス単準2級":
         case "パス単3級":
         case "パス単4級":
         case "パス単5級":
           replyText1 = "これは固有のものだから編集できないよ！";
           break;
         default:
           replyText1 = "そんなものは無かった、いいね？";
       }
       break;
     case 12://識別番号入力
       addQNum(contents,message);
       replyText1 = message+"を識別番号として追加したよ";
       replyText2 = "単語？\n完全入力クイズのときに答えとなるもの";
       writeUserData(userId,userId,UserDataCol.Status,"13");//status
       break;
     case 13://単語入力
       addAns(contents,message);
       replyText1 = message+"を単語として追加したよ";
       replyText2 = "意味？\n完全入力クイズのときに問題となるもの";
       writeUserData(userId,userId,UserDataCol.Status,"14");//status
       break;
     case 14://意味入力
       addQuiz(contents,message);
       replyText1 = message+"を意味として追加したよ";
       replyText2 = "追加した問題は確認して許可されたら出題されるようになるから気長に待っててね～";
       writeUserData(userId,UserDataCol.Status,"0");//status
       writeUserData(userId,userId,UserDataCol.Content,"0");//content
       break;
     default:
       replyText1 = "予期せぬエラーが発生したため、ユーザーの現在やっていることをリセットしました";
   }
 }
 if(status==9){
   switch(way){
     case 2:
     case 3:
       return sendLineQuickReplyFromReplyToken(replyToken, replyText1, replyText2, [replySelect[3],replySelect[4],replySelect[5],replySelect[6]]);
       break;
     case 1:
     default:
       return sendLineMessageFromReplyToken2(replyToken, replyText1, replyText2);
   }
 }else{
   if(replyText2==""){
     return sendLineMessageFromReplyToken(replyToken, replyText1);
   }else if(replyText1==""){
     return sendLineMessageFromReplyToken(replyToken, replyText2);
   }else{
     return sendLineMessageFromReplyToken2(replyToken, replyText1, replyText2);
   }
 }
 
}

