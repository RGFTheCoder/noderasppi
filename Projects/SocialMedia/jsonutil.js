var fs = require("fs");

function readFile(file) {
    return require(file);
}

function writeFile(file, obj) {
    fs.writeFileSync(file, JSON.stringify(obj));
}

var jsonutil = {
    readFile: readFile,
    writeFile: writeFile,
}

module.exports = jsonutil;