function doGet() {
  var template = HtmlService.createTemplateFromFile('index');

  template.teamList = getTeamsList();

  return template.evaluate()
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getTeamsList() {
  var sheet = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1uihaj0WfiL2ONEnjCfdYg77AcUq39UfVAuR5KWujGP0/edit#gid=0').getSheetByName('Sheet1');
  var teamsRange = sheet.getRange("D2:D");
  var teamsValues = teamsRange.getValues();

  var filteredTeams = teamsValues.flat().filter(function (teams) {
      return typeof teams === 'string' && teams.trim() !== "";
  });

  return filteredTeams;
}

function recordTime(teamSelected, ampNotesAutonInput, ampNotesTeleOpInput, speakerNotesAutonInput, speakerNotesTeleOpInput, amplifiedNotesInput, stageNotesInput, coopPointInput, robotHangInput) {

  var currentTime = new Date();
  var formattedTime = Utilities.formatDate(currentTime,"America/New_York", 'hh:mm:ss a');
  var formattedDate = Utilities.formatDate(currentTime,"America/New_York", 'yyyy-MM-dd');
  var userEmail = Session.getActiveUser().getEmail();

  var sheetName = teamSelected;
  var sheet = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1uihaj0WfiL2ONEnjCfdYg77AcUq39UfVAuR5KWujGP0/edit#gid=0').getSheetByName(sheetName);

  sheet.appendRow([formattedDate, formattedTime, teamSelected, ampNotesAutonInput, ampNotesTeleOpInput, speakerNotesAutonInput, speakerNotesTeleOpInput, amplifiedNotesInput, stageNotesInput, coopPointInput, robotHangInput, userEmail]);

  return output;
}