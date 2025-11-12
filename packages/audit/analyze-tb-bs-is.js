const XLSX = require('xlsx');
const path = require('path');

const filePath = path.join(__dirname, 'examples', 'Financial Report.xlsx');
const workbook = XLSX.readFile(filePath);

const sheetsToAnalyze = ['TB', 'BS', 'IS'];

sheetsToAnalyze.forEach(sheetName => {
  console.log('\n' + '='.repeat(100));
  console.log('SHEET: ' + sheetName);
  console.log('='.repeat(100) + '\n');
  
  const worksheet = workbook.Sheets[sheetName];
  if (!worksheet) {
    console.log('Sheet not found!');
    return;
  }
  
  const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
  
  console.log('Range: ' + worksheet['!ref']);
  console.log('Dimensions: ' + (range.e.r + 1) + ' rows x ' + (range.e.c + 1) + ' columns\n');
  
  console.log('COMPLETE DATA:\n');
  
  for (let row = 0; row <= range.e.r; row++) {
    const rowData = [];
    for (let col = 0; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
      const cell = worksheet[cellAddress];
      rowData.push(cell ? cell.v : null);
    }
    
    if (rowData.some(v => v !== null && v !== undefined)) {
      console.log(JSON.stringify({ row: row, data: rowData }));
    }
  }
  
  console.log('');
});
