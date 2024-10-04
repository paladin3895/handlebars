// index.js
var fs = require('fs');
var path = require('path');
var Handlebars = require("handlebars");

console.log("Reading template from ", process.argv[2]);
console.log("Reading json data from ", process.argv[3]);

var template = fs.readFileSync(process.argv[2], "utf-8");
var dataJson = fs.readFileSync(process.argv[3], "utf-8");

function buildHtml(template, fileData) {
    var renderTemplate = Handlebars.compile(template);
    // console.log(fileData);
    var html = renderTemplate(fileData);
    // Write to build folder. Copy the built file and deploy
    fs.writeFile("./build/index.html", html, err => {
        if (err) console.log(err);
        console.log("File written succesfully");
    });
}

// register partials
var partialDir = path.resolve(path.join(__dirname, 'template', 'partials'));
fs.promises.readdir(partialDir)
    .then((files) => {
        files.forEach(file => {
            const [name, extension] = file.split('.');
            if (extension == 'hbs') {
                Handlebars.registerPartial(name, fs.readFileSync(path.join(partialDir, file), "utf-8"));
            }
        })
    })
    .then(() => {
        var html = buildHtml(template, JSON.parse(dataJson));
    })

