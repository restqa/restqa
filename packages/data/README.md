# @restqa/data


> One of the key challenge of test automation is using up to data data, @restqa/data is a simple library to support your test automation by connecting to a specific dataset and serve it to you as a JSON object

![Build](https://github.com/restqa/restqdata/workflows/Build/badge.svg)

---

## Features

- Serve data from Google Sheet
- Serve data from Confluence
- Serve data from local csv file

---

## Usage

### The Libary way

#### Setup

Install the library into your project:

```cmd
npm i -S @restqa/data
```

---


#### Example (Getting data from google sheets)

```js
const Data = require('@restqa/data')

let options = {
  channel: 'google-sheet',
  config: {
    id: 'your-google-sheet-id',
    apikey: 'your-service-account-api-key'
  }
}

const data = Data(options)
data.get('users', 3) // get the sheet named "users" and get the row number 3
  .then(response => {
    console.log(response)
    /*
    output:
      {
        firstname: "john",
        lastname: "doe",
        column: "value",
        ...
      }
    */
  })
  .catch(err => {
    console.log(err)
  })

```

#### Example (Get the location of a flat file stored)

```js
// Let say the file 'avatar.png' is stored into the '/custom-storage' folder

const Data = require('@restqa/data')

let options = {
  storage : '/custom-storage'
}

const data = Data(options)
data.storage('users', 3)
  .then(response => {
    console.log(response)
    /*
    output: /custom-storage/avatar.png
    */
  })
  .catch(err => {
    console.log(err)
  })

```

#### Options

* `storage` (optional)  Define a storage location where you are hosting custom files, default: `/tmp/`
* `channel` (required)  should be on the the following value : `google-sheet`, `confluence`, `csv` 

##### Google sheets

* `config.id` (required) is the unique id of the google sheet ([How to find the google sheet id](https://stackoverflow.com/a/36062068))
* `config.apikey` (required) your google api service account api key ([generate google api key](https://cloud.google.com/docs/authentication/api-keys))

##### Confluence

* `config.url` (required) The url of your confluence server
* `config.space_key` (required) The space identifier where the dataset page is located
* `config.auth.username` (required) The authentication username
* `config.auth.password` (required) The authentication password
* `config.prefix_title` (optional) The prefix of your resource page , default: Dataset (example: to get the resource "user", the script will search for a page called "Dataset users")

##### Excel (csv)

* `config.folder` (required) The folder where the dataset files are stored
* `config.delimiter` (optional) delimiter userd in the csv, default: `,`

---

## License
>You can check out the full license [here](./LICENSE)

This project is licensed under the terms of the **MIT** license.
