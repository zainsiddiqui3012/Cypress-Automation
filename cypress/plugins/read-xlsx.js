//****** "Created by Owais Khan on 3 June 2022  */
////***** Run all tests of Predict360 application. */

const fs = require('fs');
const XLSX = require('xlsx');

const read = ({file, sheet}) => {
   const buf = fs.readFileSync(file);
   const workbook = XLSX.read(buf, { type: 'buffer' });
   const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
   return rows
}

    
module.exports = {
   read,
}