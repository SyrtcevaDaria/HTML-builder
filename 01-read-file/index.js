const fs = require("fs");
const path = require("path");
const myReadStream = fs.createReadStream(path.join(__dirname, "text.txt"), 'utf-8' );
myReadStream.on("data", (elem)=>console.log(elem))