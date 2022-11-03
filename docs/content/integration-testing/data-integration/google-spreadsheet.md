---
id: google-spreadsheet
sidebar_label: Google Spreadsheet
title: Integrate with Google Spreadsheet
parent: data-integration
---

Data Reuseability to avoid the manual work is what RestQA assures to its users. 

The test data plays a vital role for the API testing as it contain majority of the test case data that is passed as parameters to the API.

**Google Spreadsheet** is one of the many data sources that RestQA integrates without any hassle.

## Usage

See the following dataset example :

![Google Spreadsheet](../assets/data-google-spreadsheet.png)


We want to access to the *Cooper* lastname, as you can see it's located into :

* Sheet : *users*
* row : *4*
* Column name : *lastname*

This means if we want to use this information into one of our scenario we will need to proceed the following way :

```gherkin
Then the response body at "firstname" should equal "{{ users.4.lastname }}"
```

During the processing it will be interpreted as :


```
Then the response body at "firstname" should equal "Cooper"
```

The format should follow the pattern : `{{ <SHEET>.<ROW>.<COLUMN NAME> }}`

> If you want to use a custom interpolation charaters on the placeholder instead of `{{`  you can change the `data.startSymbol` and `data.endSymbol` into you `.restqa.yaml`

## Pre-requisite

 * 1 minute  🚀
 * Create a Google API apikey : [Guide to create a google api key for google spreadsheet](https://developers.google.com/sheets/api/quickstart/js)
 * Identify you spreadsheet ID: [Introduction here](https://developers.google.com/sheets/api/guides/concepts)
 * Valid RestQA config file.

## Configuration 

The parameters per call are just required to be entered in form of rows. Each rows represent a set of parameters being passed to API during a single call.

> The Project's **restqa.yml** file will contain the details about the Google Spreadsheet as shown below **environments.data**

```yaml
---

version: 0.0.1
metadata:
  code: SAMPLE
  name: Sample running on example.com
  description: E2E test of the public api
tests:
  integrations:
  - name: sandbox
    default: true
    data:
      channel: 'google-sheet'
      config:
      	id: 'your-google-sheet-id'
      	apikey: 'your-service-account-api-key'
```

Once the **restqa.yml** is updated as per the Google Spreadsheet, the Test Suite takes it up for the next process where the columns and rows are defined accordingly.

## Command 

If you don't want configure this part manually you can also use the command line :

```
restqa install google-sheet
```

### Options

| *Property*      | *Description*                                                  | *Default*          |
|:----------------|:---------------------------------------------------------------|:-------------------|
| `channel`       | The data channel (google-sheet in our case)                    |                    |
| `config.id`     | The id of your google sheet                                    |                    |
| `config.apikey` | Your google api credential                                     |                    |
| `startSymbol`   | Used for configuring the interpolation markup                  | `{{`               |
| `endSymbol`     | how the error message within slack                             | `}}`               |


> About the `config.id` or the `config.apikey` we recommend to use the `!env-var` keyword in order to use an [environment variable](/getting-started/environment-variable) and not expose a sensitve url into your configuration.

