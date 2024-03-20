//返答作成function

function test2(){
  Logger.log(new_quiz_sv("英単語", 0, 0, 3));
}
function test3(){
  Logger.log(list("古文単語330", 0, 0));
}
function test4(){
  Logger.log(ranking("U4f38ddc7517214c2df562560fb90ef3c"));
  Logger.log(dRanking());
  Logger.log(wRanking("U4f38ddc7517214c2df562560fb90ef3c"));
}

// スプレッドシート処理関数
function new_quiz_sv(sheetName, min, max, way){
  const count_max = 999999; // 最大出題回数

  // スプレッドシート処理
  var sheetOpen = 
    SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1OfwZqFLWpsVEB9IFHdt1qvIkiUJBTJ1P44vyt7KvjN4/');
  var sheet = sheetOpen.getSheetByName(sheetName);
  var max_r = sheet.getLastRow();
  var r,s,right_sel,s1,s2,s3,s4;
  
  if(min>max){
    [max, min] = [min, max];
  }
  if(min<=0||min>max_r){
    min=1;
  }
  if(max<=0||max>max_r){
    max=max_r;
  }

  // 最大出題回数を満たした問題は出題しない
  do {
    // 全行からランダムに1行選択
    r = Math.floor(Math.random() * (max+1-min)) + min + 1; 

    // 問題文、回答文、出題回数の取得
    if(way<3){
      var text_quiz   = sheet.getRange("I" + r).getValue() + "-" + 
                        sheet.getRange("B" + r).getValue() + "<br/>" + 
                        sheet.getRange("C" + r).getValue() + "<br/>" + 
                        sheet.getRange("D" + r).getValue();
      var text_answer = sheet.getRange("E" + r).getValue() + "<br/>" + 
                        sheet.getRange("F" + r).getValue();
      var count_q     = sheet.getRange("J" + r).getValue();
      var right_q     = sheet.getRange("K" + r).getValue();
      var ok          = sheet.getRange("L" + r).getValue();
    }else{
      var text_quiz   = sheet.getRange("I" + r).getValue() + "-" + 
                        sheet.getRange("B" + r).getValue() + "<br/>" + 
                        sheet.getRange("E" + r).getValue();
      var text_answer = sheet.getRange("C" + r).getValue() + "<br/>" + 
                        sheet.getRange("D" + r).getValue() + "<br/>" + 
                        sheet.getRange("F" + r).getValue();
      var count_q     = sheet.getRange("J" + r).getValue();
      var right_q     = sheet.getRange("K" + r).getValue();
      var ok          = sheet.getRange("L" + r).getValue();
    }
    //ここから
  } while (count_q >= count_max||ok)
  
  // 出題回数を1増加
  sheet.getRange("J" + r).setValue(count_q + 1);
  
  //選択肢
  s = ["","","",""];
  switch(way){
    case 1:
      
      break;
    case 2:
      right_sel = Math.floor(Math.random() * 4);//0~3
      for(var i = 0; i < 4; i++){
        if(i == right_sel){
          s[i] = text_answer;
        }else{
          s[i] = sheet.getRange("C" + Math.floor(Math.random() * (max+1-min) + min + 1)).getValue();
        }
      }
      break;
    case 3:
      right_sel = Math.floor(Math.random() * 4);//0~3
      for(var i = 0; i < 4; i++){
        if(i == right_sel){
          s[i] = text_answer;
        }else{
          s[i] = sheet.getRange("E" + Math.floor(Math.random() * (max+1-min) + min + 1)).getValue();
        }
      }
      break;
    default:
  }
  
  
  

  return [text_quiz, text_answer, r-1, s[0],s[1],s[2],s[3], right_sel];

}



function test(){
  new_duo_quiz("a",0,0);
}
//(DUO専用)クイズ作成
function new_duo_quiz(userId,min,max){
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
  var sheetOpen = 
    SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1OfwZqFLWpsVEB9IFHdt1qvIkiUJBTJ1P44vyt7KvjN4/');
  var sheet = sheetOpen.getSheetByName("DUO");
  var max_r = sheet.getLastRow() - 1;
  var r_row;
  var r_col;
  var quiz = {};
  var text_quiz, text_ans;
  //Logger.log(max_r);
  
  if(min>max){
    [max, min] = [min, max];
  }
  if(min<=0||min>max_r){
    min=1;
  }
  if(max<=0||max>max_r){
    max=max_r;
    Logger.log(max);
  }
  r_row = Math.floor(Math.random() * (max+1-min)) + min + 1;
  Logger.log(r_row);
  //Logger.log(sheet.getRange(4,r_row).getValue());
  for(var i=4;sheet.getRange(r_row,i).getValue()!="";i++){
    quiz[i-4] = sheet.getRange(r_row,i).getValue();
    //text_quiz = text_quiz + " " + quiz[i-4];
    Logger.log(quiz[i-4]);
  }
  
  do{
    r_col = Math.floor(Math.random() * 37) + 3;
    Logger.log(quiz[r_col]);
    Logger.log(r_col);
  }while(except(quiz[r_col]));
  
  Logger.log(quiz);
  text_quiz = (r_row-1) + "\n" + sheet.getRange(r_row,3).getValue() + "\n";
  
  for(var j=0;j<Object.keys(quiz).length;j++){
    if(j==r_col){
      text_quiz = text_quiz + " " + "(    )";
      text_ans = quiz[j];
    }else{
      text_quiz = text_quiz + " " + quiz[j];
    }
    Logger.log(text_quiz);
  }
  
  writeUserData(userId,UserDataCol.QNum,r_row-1);//qNum
  writeUserData(userId,UserDataCol.Answer,text_ans);//ans
  return text_quiz.replace("<br/>","\n").replace("<br/>","\n");
}
//DUO除外ワードか判定
function except(word){
  var except_words = [null,"\"",",",".","!","?","(",")","I","You","you","He","he","She","she","They","they","it","It","a","A","an","An","the","The","Bob","Ando","Molly"];
  for(var i=0;i<except_words.length;i++){
    if(word==except_words[i]){
      return true;
    }
  }
  return false;
}



//lineへの出題(完全一致型)



//lineへの出題(全部)
function new_quiz_line(userId,sheetName,min,max,way){
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
  var quiz_data = new_quiz_sv(sheetName,min,max,way);
  writeUserData(userId,UserDataCol.QNum,quiz_data[2]);//qNum
  writeUserData(userId,UserDataCol.Answer,quiz_data[1]);//ans
  quiz_data[0] = quiz_data[0].replace("<br/>","\n").replace("<br/>","\n");
  quiz_data[1] = quiz_data[1].replace("<br/>","\n").replace("<br/>","\n");
  return quiz_data;//quiz
}




//一覧表示
function list(sheetName,min,max){
  var sheetOpen = 
    SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1OfwZqFLWpsVEB9IFHdt1qvIkiUJBTJ1P44vyt7KvjN4/');
  var sheet = sheetOpen.getSheetByName(sheetName);
  var max_r = sheet.getLastRow() - 1;
  var r;
  
  if(min>max){
    [max, min] = [min, max];
  }
  if(min<=0||min>max_r){
    min=1;
  }
  if(max<=0||max>max_r){
    max=max_r;
  }
  min++;
  max++;
  
  var list_data = "単語リスト:" + sheetName + " " + (min-1) + "~" + (max-1);
  for(r=min;r<=max;r++){
    list_data = list_data + "\n" + 
                    sheet.getRange("I" + r).getValue() + "-" + 
                    sheet.getRange("B" + r).getValue() + "  " + 
                    sheet.getRange("C" + r).getValue() + "  Lv." + 
                    sheet.getRange("H" + r).getValue() + "\n  " + 
                    sheet.getRange("E" + r).getValue();
                    
  }
  
  return list_data;
}






//ランキング作成
function ranking(userId){
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
  var sheetOpen = 
    SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1OfwZqFLWpsVEB9IFHdt1qvIkiUJBTJ1P44vyt7KvjN4/');
  var sheetUserData = sheetOpen.getSheetByName('UserData');
  var max_r = sheetUserData.getLastRow();
  var userScore, rankingText, userRank;
  var rankingData = new Array();
  for(var r=2;r<=max_r;r++){
    rankingData[r-2]= ["",0];
    if(userId==sheetUserData.getRange(UserDataCol.UserId + r).getValue()){
      userScore = sheetUserData.getRange(UserDataCol.Score + r).getValue();
    }
    if(!sheetUserData.getRange(UserDataCol.DisplayName + r).getValue()){
      rankingData[r-2][0] = sheetUserData.getRange(UserDataCol.UserId + r).getValue();
    }else{
      rankingData[r-2][0] = sheetUserData.getRange(UserDataCol.DisplayName + r).getValue();
    }
    rankingData[r-2][1]=sheetUserData.getRange(UserDataCol.Score + r).getValue();
    if(r==max_r&&userId&&!userScore){
      r=r+1;
      sheetUserData.getRange(UserDataCol.UserId + r).setValue(userId);
      sheetUserData.getRange(UserDataCol.Score + r).setValue("0");
      userScore = 0;
    }
  }
  //大きい順に並び替え
  rankingData.sort(function(a,b){return(b[1] - a[1]);});
  for(var i=0;i<rankingData.length;i++){
    if(rankingData[i][1]==userScore){
      userRank=i+1;
    }
  }
  rankingText ="<ランキング>\n1."+rankingData[0][0]+" → "+rankingData[0][1]+"p\n2."+rankingData[1][0]+" → "+rankingData[1][1]+"p\n3."+rankingData[2][0]+" → "+rankingData[2][1]+"p\n4."+rankingData[3][0]+" → "+rankingData[3][1]+"p\n5."+rankingData[4][0]+" → "+rankingData[4][1]+"p\nあなたは"+userScore+"pで"+userRank+"位です";
  return rankingText;
}



//developer用ランキング
function dRanking(){
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
  var sheetOpen = 
    SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1OfwZqFLWpsVEB9IFHdt1qvIkiUJBTJ1P44vyt7KvjN4/');
  var sheetUserData = sheetOpen.getSheetByName('UserData');
  var max_r = sheetUserData.getLastRow();
  var rankingText = "";
  var rankingData = new Array();
  for(var r=2;r<=max_r;r++){
    rankingData[r-2]= ["",0];
    if(!sheetUserData.getRange(UserDataCol.DisplayName + r).getValue()){
      rankingData[r-2][0] = sheetUserData.getRange(UserDataCol.UserId + r).getValue();
    }else{
      rankingData[r-2][0] = sheetUserData.getRange(UserDataCol.DisplayName + r).getValue();
    }
    rankingData[r-2][1]=sheetUserData.getRange(UserDataCol.Score + r).getValue();
  }
  //大きい順に並び替え
  rankingData.sort(function(a,b){return(b[1] - a[1]);});
  for(var i=0;i<rankingData.length;i++){
    rankingText = rankingText + (i+1) + "." +rankingData[i][0]+" → "+rankingData[i][1]+"p\n";
  }
  return rankingText;
}



//週間ランキング
function wRanking(userId){
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
                       Developer:"L",
                       Thisweek:"M",
                       Lastweek:"N"
                    };
  var sheetOpen = 
    SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1OfwZqFLWpsVEB9IFHdt1qvIkiUJBTJ1P44vyt7KvjN4/');
  var sheetUserData = sheetOpen.getSheetByName('UserData');
  var max_r = sheetUserData.getLastRow();
  var userScore, userRank;
  var rankingText = "";
  var rankingData = new Array();
  for(var r=2;r<=max_r;r++){
    rankingData[r-2]= ["",0];
    if(userId==sheetUserData.getRange(UserDataCol.UserId + r).getValue()){
      userScore = parseInt(sheetUserData.getRange(UserDataCol.Score + r).getValue()) - parseInt(sheetUserData.getRange(UserDataCol.Thisweek + r).getValue());
    }
    if(!sheetUserData.getRange(UserDataCol.DisplayName + r).getValue()){
      rankingData[r-2][0] = sheetUserData.getRange(UserDataCol.UserId + r).getValue();
    }else{
      rankingData[r-2][0] = sheetUserData.getRange(UserDataCol.DisplayName + r).getValue();
    }
    rankingData[r-2][1]=parseInt(sheetUserData.getRange(UserDataCol.Score + r).getValue()) - parseInt(sheetUserData.getRange(UserDataCol.Thisweek + r).getValue());
  }
  //大きい順に並び替え
  rankingData.sort(function(a,b){return(b[1] - a[1]);});
  for(var i=0;i<rankingData.length;i++){
    if(rankingData[i][1]==userScore){
      userRank=i+1;
    }
  }
  rankingText = "※上昇者のみ掲載\n<今週上昇ランキング>\n";
  for(var i=0;i<rankingData.length, rankingData[i][1]>0;i++){
    rankingText = rankingText + (i+1) + "." +rankingData[i][0]+" → +"+rankingData[i][1]+"p\n";
  }
  rankingText = rankingText + "あなたは+"+userScore+"pで"+userRank+"位です";
  //一旦リセットして先週のランキングの処理
  rankingData = [];
  for(var r=2;r<=max_r;r++){
    rankingData[r-2]= ["",0];
    if(userId==sheetUserData.getRange(UserDataCol.UserId + r).getValue()){
      userScore = parseInt(sheetUserData.getRange(UserDataCol.Thisweek + r).getValue()) - parseInt(sheetUserData.getRange(UserDataCol.Lastweek + r).getValue());
    }
    if(!sheetUserData.getRange(UserDataCol.DisplayName + r).getValue()){
      rankingData[r-2][0] = sheetUserData.getRange(UserDataCol.UserId + r).getValue();
    }else{
      rankingData[r-2][0] = sheetUserData.getRange(UserDataCol.DisplayName + r).getValue();
    }
    rankingData[r-2][1] = parseInt(sheetUserData.getRange(UserDataCol.Thisweek + r).getValue()) - parseInt(sheetUserData.getRange(UserDataCol.Lastweek + r).getValue());
  }
  //大きい順に並び替え
  rankingData.sort(function(a,b){return(b[1] - a[1]);});
  for(var i=0;i<rankingData.length;i++){
    if(rankingData[i][1]==userScore){
      userRank=i+1;
    }
  }
  rankingText = rankingText + "\n\n<先週上昇ランキング>\n";
  for(var i=0;i<rankingData.length, rankingData[i][1]>0;i++){
    rankingText = rankingText + (i+1) + "." +rankingData[i][0]+" → +"+rankingData[i][1]+"p\n";
  }
  rankingText = rankingText + "あなたは+"+userScore+"pで"+userRank+"位です";
  return rankingText;
}
