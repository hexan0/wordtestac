function weeklyAction() {
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
  for(var r=2;r<=max_r;r++){
    sheetUserData.getRange(UserDataCol.Lastweek + r).setValue(sheetUserData.getRange(UserDataCol.Thisweek + r).getValue());
    sheetUserData.getRange(UserDataCol.Thisweek + r).setValue(sheetUserData.getRange(UserDataCol.Score + r).getValue());
  }
  
}
