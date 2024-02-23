function onOpen() {
  var menu = SpreadsheetApp.getUi().createMenu("Update");
  menu.addItem("Pull Teams", "writeToSheet");
  menu.addItem("Make the Sheets", "createSheetsForTeams");
  menu.addToUi();
}

function writeToSheet() {
  var apiKey = 'kvBQWV3KPGgKPUZFX7uRcJv55VBR3ibgS66wZ1TWFjo3lmkBepeRiQsw6EHoznM9';
  var apiUrl = 'https://www.thebluealliance.com/api/v3/event/2024ncwak/teams';

  var headers = {
    'accept': 'application/json',
    'X-TBA-Auth-Key': apiKey
  };

  var response = UrlFetchApp.fetch(apiUrl, {
    method: 'get',
    headers: headers
  });

  var responseData = JSON.parse(response.getContentText());

  var teams = responseData.map(function(team) {
    return [team.nickname, team.team_number, "", team.nickname + " - " + team.team_number];
  });

  var sheetUrl = 'https://docs.google.com/spreadsheets/d/1uihaj0WfiL2ONEnjCfdYg77AcUq39UfVAuR5KWujGP0/edit#gid=0';
  var spreadsheet = SpreadsheetApp.openByUrl(sheetUrl);
  var sheet = spreadsheet.getSheetByName('Sheet1');

  sheet.getRange('A2:L').clearContent();

  sheet.getRange(2, 1, teams.length, 4).setValues(teams);

  Logger.log('Done');
}

function createSheetsForTeams() {
  var spreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1uihaj0WfiL2ONEnjCfdYg77AcUq39UfVAuR5KWujGP0/edit#gid=0';
  var sheetName = 'Sheet1';
  var headerValues = ["Date", "Time", "Team", "Amp Notes in Auton",	"Amp Notes in TeleOp",	"Speaker Notes in Auton",	"Speaker Notes in TeleOp",	"Amplified Speaker Notes",	"Stage Notes", "Cooperation Point", "Able to Hang", "User"]; // Example header values
  var spreadsheet = SpreadsheetApp.openByUrl(spreadsheetUrl);
  var sheet = spreadsheet.getSheetByName(sheetName);
  
  // Assuming team names are in column A starting from the second row
  var teamNames = sheet.getRange("D2:D" + sheet.getLastRow()).getValues().flat();
  
  for (var i = 0; i < teamNames.length; i++) {
    var teamName = teamNames[i];
    
    // Check if the sheet exists
    var existingSheet = spreadsheet.getSheetByName(teamName);
    
    if (!existingSheet) {
      // If the sheet does not exist, create a new sheet with the team name
      var newSheet = spreadsheet.insertSheet(teamName);
      
      // Add the header values to the first line
      newSheet.getRange(1, 1, 1, headerValues.length).setValues([headerValues]);
      
      // Freeze the first row
      newSheet.setFrozenRows(1);
      
      // Make the first row bold
      newSheet.getRange(1, 1, 1, headerValues.length).setFontWeight("bold");
      
      // Resize columns to fit text with a minimum width
      newSheet.autoResizeColumns(1, headerValues.length);
      newSheet.setColumnWidths(1, headerValues.length, minColumnWidth);
    } else {
      // If the sheet exists, check if it has the correct header values
      var sheetHeaderValues = existingSheet.getRange(1, 1, 1, headerValues.length).getValues()[0];
      
      if (!arraysEqual(sheetHeaderValues, headerValues)) {
        // If the header values are different, update them
        existingSheet.getRange(1, 1, 1, headerValues.length).setValues([headerValues]);
      }
      
      // Freeze the first row
      existingSheet.setFrozenRows(1);
      
      // Make the first row bold
      existingSheet.getRange(1, 1, 1, headerValues.length).setFontWeight("bold");
      
      existingSheet.setColumnWidths(1, 3, 100);
      existingSheet.setColumnWidths(4, 12, 200);
    }
  }
}

// Helper function to compare arrays
function arraysEqual(arr1, arr2) {
  return JSON.stringify(arr1) === JSON.stringify(arr2);
}


//imadeachange