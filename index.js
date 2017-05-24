const getAllFiles = require('./filesHelper');

/**
 * Given an object, returns the length of its key or 0 if none
 * @param object
 */
const getObjectLength = (object) => object ? Object.keys(object).length : 0;

const getMetric = (service, metric) => service[metric] ? service[metric].length : 0;

const extractMetrics = (yamlObject) => {

    let metrics = {};
    let {file, yaml} = yamlObject;
    let services = yaml.services;
    let networks = yaml.networks;

    // Get metrics only for files with "services"
    if(services) {

        metrics.version = parseFloat(yaml.version);
        metrics.numberOfServices = getObjectLength(services);
        metrics.numberOfNetworks = getObjectLength(networks);
        metrics.dependsOn = [];
        metrics.ports = [];
        metrics.volumes = [];

        // Extract metrics for each service
        for(serviceKey in services) {
            let service = services[serviceKey];
            metrics.dependsOn.push(getMetric(service, 'depends_on'));
            metrics.ports.push(getMetric(service, 'ports'));
            metrics.volumes.push(getMetric(service, 'volumes'));
        }

        return metrics;
    }

};

getAllFiles.then(files => {

    // Extract metrics for files
    let metricsPerFile = files.map(extractMetrics).filter(d => !!d);

    console.log(metricsPerFile)
});