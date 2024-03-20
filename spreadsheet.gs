//結果等書き込みのため、読み書きのためだけのfunction

//得点時得点書き込み
function getPoint(userId, contents, qNum){
  var sheetOpen = 
    SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/'+SS);
  var sheet = sheetOpen.getSheetByName(contents);
  var sheetUserData = sheetOpen.getSheetByName('UserData');
  var count_q = 1;
  var right_q = 0;
  if(qNum!=null){
    qNum++;
    if(contents!="DUO"){
      count_q     = sheet.getRange("J" + qNum).getValue();
      right_q     = sheet.getRange("K" + qNum).getValue();
      sheet.getRange("K" + qNum).setValue(right_q + 1);
    }
    if(userId!=null){
      var gotPoint = Math.round((100-right_q*100/count_q)/10);
      writeUserData(userId, "C", readUserData(userId, "C") + gotPoint);
    }
  }
}



//問題追加関数×3
//番号追加
function addQNum(sheetName,qNum){
  var sheetOpen = 
    SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/'+SS);
  var sheet = sheetOpen.getSheetByName(sheetName);
  var write_r = sheet.getLastRow() +1;
  sheet.getRange("B" + write_r).setValue(qNum);
}
//単語追加
function addAns(sheetName,ans){
  var sheetOpen = 
    SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/'+SS);
  var sheet = sheetOpen.getSheetByName(sheetName);
  var write_r = sheet.getLastRow();
  sheet.getRange("D" + write_r).setValue(ans);
}
//説明追加
function addQuiz(sheetName,quiz){
  var sheetOpen = 
    SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/'+SS);
  var sheet = sheetOpen.getSheetByName(sheetName);
  var write_r = sheet.getLastRow();
  sheet.getRange("E" + write_r).setValue(quiz);
  sheet.getRange("L" + write_r).setValue("1");
}



//UserDataの読み込み、rowはAから列文字指定、
function readUserData(userId,row){
  var sheetOpen = 
    SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/'+SS);
  var sheetUserData = sheetOpen.getSheetByName('UserData');
  var max_r = sheetUserData.getLastRow();
  for(var r=2;userId!=sheetUserData.getRange("A" + r).getValue();r++){
    if(r==max_r){
      r=r+1;
      sheetUserData.getRange("A" + r).setValue(userId);
      break;
    }
  }
  return sheetUserData.getRange(row + r).getValue();
}

//UserDataの書き換え、rowはAから列文字指定、
function writeUserData(userId,row,writeText){
  var sheetOpen = 
    SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/'+SS);
  var sheetUserData = sheetOpen.getSheetByName('UserData');
  var max_r = sheetUserData.getLastRow();
  for(var r=2;userId!=sheetUserData.getRange("A" + r).getValue();r++){
    if(r==max_r){
      r=r+1;
      sheetUserData.getRange("A" + r).setValue(userId);
      break;
    }
  }
  sheetUserData.getRange(row + r).setValue(writeText);
}
