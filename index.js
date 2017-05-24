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

const getYamlObjectFromFile = file => {
    return readFileSync(`${dockerFilesFolder}/${file}`)
        .then((fileContent) => {
            return YAML.parse(fileContent);
        })
        .catch(err => console.warn(err));

};


getFiles
    .then(files => {
        let promises = files.map(getYamlObjectFromFile);

        Promise.all(promises).then(yamlObjects => {
            console.log(yamlObjects.length)
        })

    })