const fs = require('fs');
const path = require('path');
const fsPromises = require('fs').promises;

fs.stat(path.join(__dirname, 'project-dist'), (err) => {
  if (err) {
    if (err.code === 'ENOENT') {
      builder();
    } else {
      console.error(`Ошибка:`, err);
    }
  } else {
    fs.rm(path.join(__dirname, 'project-dist'), { recursive: true }, (err) => {
      if (err) {
        console.log(`Ошибка:`, err);
      } else {
        builder();
      }
    });
  }
});

function builder() {
  function toDoCopy(originPath, newPath) {
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

  async function bundleHTML() {
    const sourseFile = path.join(__dirname, 'template.html');
    const destFile = path.join(__dirname, 'project-dist', 'index.html');
    const compFile = path.join(__dirname, 'components');
    const components = [];
    const files = await fsPromises.readdir(compFile, { withFileTypes: true });
    for (const file of files) {
      const pathToFile = path.join(compFile, file.name);
      if (path.extname(pathToFile) === '.html') {
        const htmlContent = await fsPromises.readFile(
          path.join(compFile, file.name),
          'utf8',
        );
        const name = file.name.split('.')[0];
        components.push({ name: name, data: htmlContent });
      }
    }

    let htmlContent = await fsPromises.readFile(sourseFile, 'utf8');

    components.forEach((component) => {
      let position = htmlContent.indexOf('{{' + component.name + '}}');
      if (position > 0) {
        let before = htmlContent.slice(0, position);
        let after = htmlContent.slice(position + component.name.length + 4);
        htmlContent = before + component.data + after;
      }
    });
    await fsPromises.writeFile(destFile, htmlContent);
  }

  bundleHTML();

  fs.mkdir(path.join(__dirname, 'project-dist'), { recursive: true }, (err) => {
    if (err) {
      return console.error(err);
    } else {
      const dest = fs.createWriteStream(
        path.join(__dirname, 'project-dist', 'style.css'),
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
                const source = fs.createReadStream(filePath);
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
      const originPath = path.join(__dirname, 'assets');
      const newPath = path.join(__dirname, 'project-dist', 'assets');
      toDoCopy(originPath, newPath);
    }
  });
}
