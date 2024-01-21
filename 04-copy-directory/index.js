const fs = require('fs');
const path = require('path');



fs.stat(path.join(__dirname, 'files-copy'), (err) => {
  if (err) {
    if (err.code === 'ENOENT') {
      myFunc();
    } else {
      console.error(`Ошибка:`, err);
    }
  } else {
    fs.rm(path.join(__dirname, 'files-copy'), { recursive: true }, (err) => {
      if (err) {
        console.log(`Ошибка:`, err);
      } else {
        myFunc();
      }
    });
  }
});

function myFunc(){
  async function toDoCopy(originPath, newPath) {
    await fs.mkdir(path.join(__dirname, 'files-copy'), { recursive: true }, (err) => {
      if (err) {
        return console.error(err);
      }
    });
    fs.readdir(originPath, { withFileTypes: true }, (err, files) => {
      if (err) {
        console.log('Ошибка', err);
        return;
      }
      files.forEach((file) => {
        const filePath = path.join(originPath, file.name);
        const filePathNew = path.join(newPath, file.name);
        if (file.isFile()) {
          fs.copyFile(filePath, filePathNew, (err) => {
            if (err) {
              console.log('Ошибка', err);
            }
          });
        }
        if (file.isDirectory()) {
          fs.mkdir(filePathNew, { recursive: true }, (err) => {
            if (err) {
              return console.error(err);
            }
            toDoCopy(filePath, filePathNew);
          });
        }
      });
    });
  }
  
  const originPath = path.join(__dirname,'files');
  const newPath = path.join(__dirname,'files-copy');
  toDoCopy(originPath, newPath);
}

