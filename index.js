const getAllFiles = require('./filesHelper');

/**
 * Given an object, returns the length of its key or 0 if none
 * @param object
 */
const getObjectLength = (object) => object ? Object.keys(object).length : 0;

const getMetric = (service, metric) => service[metric] ? service[metric].length : 0;

const getTotal = (obj) => {
    let cont = 0;
    for (let key in obj) {
        cont += obj[key];
    }
    return cont;
};

const extractMetrics = (yamlObject) => {

    let metrics = {};
    let {file, yaml} = yamlObject;
    let services = yaml.services;
    let networks = yaml.networks;

    // Get metrics only for files with "services"
    if (services) {

        metrics.file = file;
        metrics.version = parseFloat(yaml.version);
        metrics.numberOfServices = getObjectLength(services);
        metrics.numberOfNetworks = getObjectLength(networks);
        metrics.dependsOn = [];
        metrics.ports = [];
        metrics.volumes = [];

        // Extract metrics for each service
        for (serviceKey in services) {
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

    // Extract general metrics
    let metrics = {};

    metrics.version = {};
    metrics.numberOfServices = {};
    metrics.numberOfNetworks = {};
    metrics.dependsOn = {};
    metrics.ports = {};
    metrics.volumes = {};

    metricsPerFile.map(fileMetric => {

        // console.log(fileMetric)

        //////////////////////////////////ANALISE ARQUIVO//////////////////////////
        /**
         * Em relação ao arquivo
         */
        if (metrics.version[fileMetric.version]) {
            metrics.version[fileMetric.version] += 1;
        } else {
            metrics.version[fileMetric.version] = 1;
        }
        /**
         * Em relação ao arquivo
         */
        if (metrics.numberOfServices[fileMetric.numberOfServices]) {
            metrics.numberOfServices[fileMetric.numberOfServices] += fileMetric.numberOfServices;
        } else {
            metrics.numberOfServices[fileMetric.numberOfServices] = fileMetric.numberOfServices;
        }
        /**
         * Em relação ao arquivo
         */
        if (metrics.numberOfNetworks[fileMetric.numberOfNetworks]) {
            metrics.numberOfNetworks[fileMetric.numberOfNetworks] += 1;
        } else {
            metrics.numberOfNetworks[fileMetric.numberOfNetworks] = 1;
        }
        //////////////////////////////////ANALISE ARQUIVO//////////////////////////


        //////////////////////////////////ANALISE SERVICO//////////////////////////
        /**
         * Em relação ao serviço
         */
        fileMetric.dependsOn.map((dependsOn => {
            if (metrics.dependsOn[dependsOn]) {
                metrics.dependsOn[dependsOn] += 1;
            } else {
                metrics.dependsOn[dependsOn] = 1;
            }
        }));
        /**
         * Em relação ao serviço
         */
        fileMetric.ports.map((ports => {
            if (metrics.ports[ports]) {
                metrics.ports[ports] += 1;
            } else {
                metrics.ports[ports] = 1;
            }
        }));
        /**
         * Em relação ao serviço
         */
        fileMetric.volumes.map((volumes => {
            if (metrics.volumes[volumes]) {
                metrics.volumes[volumes] += 1;
            } else {
                metrics.volumes[volumes] = 1;
            }
        }));
        //////////////////////////////////ANALISE SERVICO///////////////////////////
    });

    let finalMetrics = {
        serv_dependsOn: metrics.dependsOn,
        serv_dependsOnTotal: getTotal(metrics.dependsOn),
        file_numberOfNetworks: metrics.numberOfNetworks,
        file_numberOfNetworksTotal: getTotal(metrics.numberOfNetworks),
        file_numberOfServices: metrics.numberOfServices,
        file_numberOfServicesTotal: getTotal(metrics.numberOfServices),
        serv_ports: metrics.ports,
        serv_portsTotal: getTotal(metrics.ports),
        file_version: metrics.version,
        file_versionTotal: getTotal(metrics.version),
        serv_volumes: metrics.volumes,
        serv_volumesTotal: getTotal(metrics.volumes),
    };

    console.log(finalMetrics)
});