列出 game/ 資料夾中所有遊戲的名稱與描述。

執行以下指令取得資料：

```bash
node -e "
const fs = require('fs');
const path = require('path');
const gameDir = path.join(process.cwd(), 'game');
const index = fs.readFileSync(path.join(gameDir, 'index.html'), 'utf8');
const pattern = /<a class=\"game-card\" href=\"([^\"]+)\">\s*<div class=\"game-icon\">([^<]+)<\/div>\s*<div class=\"game-title\">([^<]+)<\/div>\s*<div class=\"game-desc\">([^<]*)<\/div>/gs;
for (const m of index.matchAll(pattern)) {
  console.log(m[2].trim() + ' ' + m[3].trim() + ' — ' + (m[4].trim() || '（無描述）'));
}
"
```

將結果整理成簡單的列表回覆給 user。
