const { stdin, stdout } = process;
const fs = require('fs');
const path = require('path');

const output = fs.createWriteStream(path.join(__dirname, 'answer.txt'));
console.log(path.join(__dirname, 'answer.txt'));
function hundler(data) {
  if (data.toString().trim() == 'exit') {
    process.exit();
  } else {
    output.write(data);
  }
}
stdout.write('Здравствуйте, пожалуйста, введите сообщение:\n');
stdin.on('data', hundler);
process.on('SIGINT', () => process.exit());
process.on('exit', () => stdout.write('До свидания!\n'));
