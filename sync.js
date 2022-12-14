const fs = require('fs');
const { getJoinedObject } = require('.');

const currentPath = process.argv[0];
const args = process.argv.slice(2);
const configFileName = args[0] ?? 'gsheet.config.js';
const config = require(`${currentPath}/../../../../../${configFileName}`);

const docID = config?.docID;
const credentialsPath = config?.credentialsPath ? `${currentPath}/../../../../../${config.credentialsPath}` : `${currentPath}/../../../../../credentials.json`;
const sheets = config?.sheets ?? [];

sheets.forEach((sheet) => {
  const { sheetID } = sheet;
  const files = sheet.files ?? [];
  files.forEach(async (file) => {
    if (!file.filePath) return;
    const data = await getJoinedObject({
      docID,
      sheetID,
      credentialsPath,
      prefix: file.prefix,
      keyColumns: file.keyColumns,
      valueColumns: file.valueColumns,
    });
    const content = `${JSON.stringify(data, null, 2)}\n`;
    fs.writeFile(file.filePath, content, (error) => {
      if (error) throw error;
      console.log(`Successfully generate ${file.filePath} !`);
    });
  });
});
