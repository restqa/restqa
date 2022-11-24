# Install your RestQA Dashboard into Grafana

![grafana](https://restqa.io/assets/img/utils/screenshot-grafana.png)

As mentionned you will be able to get the result of your automation test into your own grafana instance.
However Grafana is just the visualization part. It's important to understand is only working if your are using Elastic Search to store the data result.

## Prerequisite

- [ ] Get your Elastic Search Url :  `YOUR-ELASTIC-SEARCH-URL`
- [ ] Get your Grafana Url : `YOUR-GRAFANA-URL`
- [ ] Get your Grafana credentials `YOUR-GRAFANA-USERNAME` , `YOUR-GRAFANA-PASSWORD`
- [ ] Install the Pie Chart plugin into your grafana : [https://grafana.com/grafana/plugins/grafana-piechart-panel](https://grafana.com/grafana/plugins/grafana-piechart-panel)

## Getting started 

### 1. Create the data source

In order to install the dashboard the first thing is to create a data source connected to your Elastic Search instance.

Use the following curl command to create the datasource (Replace the placehoders with your own values).

```
curl --request POST \
  --url http://[YOUR-GRAFANA-USERNAME]:[YOUR-GRAFANA-PASSWORD]@[YOUR-GRAFANA-URL]/api/datasources \
  --header 'content-type: application/json' \
  --data '{
    "name": "Elasticsearch",
    "type": "elasticsearch",
    "access": "proxy",
    "url": "http://[YOUR-ELASTIC-SEARCH-URL]",
    "password": "",
    "user": "",
    "database": "restqa-e2e-result-*",
    "basicAuth": false,
    "jsonData": {
      "esVersion": 70,
      "logLevelField": "",
      "logMessageField": "",
      "maxConcurrentShardRequests": 5,
      "timeField": "timestamp"
    },
    "readOnly": false
  }'
```

### 2. Import the Dashboard

In order to import the dashboard you just need to click on Import from the "**+**" on the left menu.

Then import the content from the file : [RestQa-grafana-dashboard-v0.json](./RestQa-grafana-dashboard-v0.json)


### 3. And Voila !

You can start playing, updating or upgrading your new dashboard.

Don't forget to share your new enhancement if you create improvment.

All pull Request are welcomed