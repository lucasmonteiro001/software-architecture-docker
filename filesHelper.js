const fs = require('fs');
const YAML = require("yamljs");

const dockerFilesFolder = './docker-compose';

/**
 * Returns Promise to read file
 * @param file
 */
const readFile = (file) =>
    new Promise((resolve, reject) => {
        fs.readFile(file, 'utf8', function (err, data) {
            if (err) {
                reject(err);
            }
            resolve(data);
        });
    });

/**
 * Get all file names from the #docker-compose folder
 * @type {Promise}
 */
const getFiles = new Promise((resolve) => {

    let files = [];

    fs.readdirSync(dockerFilesFolder).forEach(function (file) {
        files.push(file);
    });

    resolve(files);
});

/**
 * Convert file to yaml object
 * @param file
 * @return {Promise.<TResult>}
 */
const getYamlObjectFromFile = file => {
    return readFile(`${dockerFilesFolder}/${file}`)
        .then((fileContent) => {
            return {file, yaml: YAML.parse(fileContent)};
        })
        .catch(err => console.warn(err));

};


/**
 * Returns a Promise with all yamlObjects from files
 * @type {Promise}
 */
module.exports = new Promise((resolve) => {
    getFiles
        .then(files => {
            let promises = files.map(getYamlObjectFromFile);

            Promise.all(promises).then(yamlObjects => {
                resolve(yamlObjects)
            })

        });
});