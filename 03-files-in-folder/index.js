const fs = require('fs');
const path = require('path');
const { stdout } = process;
fs.readdir(
  path.join(__dirname, 'secret-folder'),
  { withFileTypes: true },
  (err, files) => {
    if (err) {
      console.log('Ошибка', err);
    } else {
      files.forEach((file) => {
        if (file.isFile()) {
            const filePath = path.join(__dirname, "secret-folder", file.name);
            const name = path.parse(filePath).name;
            const extension = path.parse(filePath).ext;
            fs.stat(filePath, (err, elem)=>{
                if(err){
                    console.log("Ошибка", err);
                }
                stdout.write(`${name} - ${extension.slice(1)} - ${elem.size}B\n`);
            })
            
        }
      });
    }
  },
);
