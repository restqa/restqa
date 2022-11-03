---
id: excel
sidebar_label: Excel
title: Integrate with Excel (CSV)
parent: data-integration
---

Data Reuseability to avoid the manual work is what RestQA assures to its users. 

The test data plays a vital role for the API testing as it contain majority of the test case data that is passed as parameters to the API.

**Excel (csv)** is one of the many data sources that RestQA integrates without any hassle.

## Usage

See the following dataset example locate on the file : **./tests/data/users.csv**:

![Excell](../assets/screenshot-excel.png)



We want to access to the *Cooper* lastname, as you can see it's located into :

* filename : *users*
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

The format should follow the pattern : `{{ <FILENAME>.<ROW>.<COLUMN NAME> }}`

> If you want to use a custom interpolation charaters on the placeholder instead of `{{`  you can change the `data.startSymbol` and `data.endSymbol` into you `.restqa.yaml`

## Pre-requisite

 * 1 minute  🚀
 * Create new csv file on a specific folder (example : ./tests/data)
 * Valid RestQA config file.

## Configuration 

The parameters per call are just required to be entered in form of rows. Each rows represent a set of parameters being passed to API during a single call.

> The Project's **restqa.yml** file will contain the details about the Google Spreadsheet as shown below **environments.data**

```yaml {11-15} title=".restqa.yml" 
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
      channel: 'csv'
      config:
        folder: 'test/data'
      	delimiter: ','
```

Once the **restqa.yml** is updated as per the Csv, the Test Suite takes it up for the next process where the columns and rows are defined accordingly.

## Command 

If you don't want configure this part manually you can also use the command line :

```
restqa install excel
```

### Options

| *Property*         | *Description*                                                  | *Default*          |
|:-------------------|:---------------------------------------------------------------|:-------------------|
| `channel`          | The data channel (csv in our case)                             |                    |
| `config.folder`    | The folder where the csv files are located                     |                    |
| `config.delimiter` | The csv column delimiter character                             | `,`                |
| `startSymbol`      | Used for configuring the interpolation markup                  | `{{`               |
| `endSymbol`        |  Used for configuring the interpolation markup                 | `}}`               |

