const fs = require('fs');
const YAML = require("yamljs");

const dockerFilesFolder = './docker-compose';

const readFileSync = (file) =>
    new Promise((resolve, reject) => {
        fs.readFile(file, 'utf8', function (err, data) {
            if (err) {
                reject(err);
            }
            resolve(data);
        });
    });

const getFiles = new Promise((resolve) => {

    let files = [];

    fs.readdirSync(dockerFilesFolder).forEach(function (file) {
        files.push(file);
    });

    resolve(files);
});


getFiles
    .then(files => {

        let yamlObjects = [];

        files.map(file => {
            readFileSync(`${dockerFilesFolder}/${file}`)
                .then((fileContent) => {
                    // console.log(YAML.parse(fileContent))
                    yamlObjects.push(YAML.parse(fileContent));
                    console.log(fileContent)
                })
                .catch(err => console.warn(err));
        });

    })