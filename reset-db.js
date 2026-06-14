const fs = require('node:fs');
const path = require('node:path');

const dbDir = path.join(__dirname, 'data');
const files = ['app.db', 'app.db-shm', 'app.db-wal'].map((file) => path.join(dbDir, file));

for (const file of files) {
  if (fs.existsSync(file)) {
    fs.rmSync(file);
    console.log(`Removed ${path.relative(__dirname, file)}`);
  }
}

console.log('資料庫已重置。請重新執行 npm start，系統會自動建立測試資料。');
