const fs = require('fs');
const path = require('path');

const dest = fs.createWriteStream(
  path.join('05-merge-styles', 'project-dist', 'bundle.css'),
);
let styleArr = [];
fs.readdir(
  path.join(__dirname, 'styles'),
  { withFileTypes: true },
  (err, files) => {
    if (err) {
      console.log('Ошибка', err);
      return;
    }
    let fileCounter = 0;
    files.forEach((file) => {
      if (file.isFile()) {
        const filePath = path.join(__dirname, 'styles', file.name);
        const extention = path.extname(filePath);
        if (extention === '.css') {
          const source = fs.createReadStream(filePath, 'utf-8');
          source.on('data', (data) => {
            styleArr.push(data);
          });
          source.on('end', () => {
            fileCounter++;
            if (fileCounter === files.length) {
              dest.write(styleArr.join(''));
              dest.end();
            }
          });
        } else {
          fileCounter++;
          if (fileCounter === files.length) {
            dest.write(styleArr.join(''));
            dest.end();
          }
        }
      } else {
        fileCounter++;
        if (fileCounter === files.length) {
          dest.write(styleArr.join(''));
          dest.end();
        }
      }
    });
  },
);

