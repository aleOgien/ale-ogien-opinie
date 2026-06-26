function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('opinie');
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('opinie');
    sheet.appendRow(['Data', 'Kelner ID', 'Kelner', 'Ocena', 'Komentarz', 'Strona', 'Telefon/przeglądarka']);
  }

  var data = JSON.parse(e.postData.contents || '{}');

  sheet.appendRow([
    new Date(),
    data.waiterKey || '',
    data.waiterName || '',
    data.rating || '',
    data.comment || '',
    data.page || '',
    data.userAgent || ''
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
