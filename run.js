const fs = require('fs');
const dbHelpers = require('./dbHelpers');

//Read table data specification from config.json
const tables = JSON.parse(fs.readFileSync("./config.json", "utf-8"));

//Write each file
for (const table of tables) {
  dbHelpers.writeSeedFile(table.name, table.columns, table.noRecords);
}
