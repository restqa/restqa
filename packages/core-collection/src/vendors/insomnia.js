module.exports = function (projectName, features) {

    const feature = features['GET /'];

    const host = feature[0].options.hostname + ':' + feature[0].options.port;

    const resources = [];
    
    for (const item of feature) {
        const {options, scenario} = item;

        const headers = Object.entries(options.headers).filter((header) => {
          if (header[0] !== 'x-correlation-id' && header[0] !== 'user-agent') return header;
        })
        .map((header) => {
            return {
                "name": header[0],
                "value": header[1],
            }
        })

        const obj = {
            "_id": "req_restqa",
            "url": "",
            "name": scenario.pickle.name,
            "description": "",
            "method": options.method,
            "body": {},
            "parameters": [],
            "headers": headers,
            "authentication": {},
            "_type": "request"
        }
        
        resources.push(obj);
    }

    resources.push(
        {
            "_id": "req_restqa-base-url",
            "parentId": "req_restqa",
            "name": projectName,
            "description": "",
            "environment": {
                "host": host
            },
            "_type": "request_group"
        }
    )
    
    return {
        "resources": resources
    };
};
