---
id: postman
title: Postman
parent: api-collection
order: 1
---

Using the **Postman** collection is simple:

## Pre-requisite

 * 1 minute  🚀
 * Install Postman
 * Valid RestQA configuration file

## Configuration 

```yaml
# .restqa.yml
---
version: 0.0.1
metadata:
  code: EXAMPLE-RESTQA
  name: Example Restqa
  description: Delicious Microservice example maintained with RestQA
tests:
  local:
    port: 8887
    command: npm run dev
```

Then once your run the command:

```bash
restqa run --report
```

You will have access to your report and on the section [API collection](#/collection) you will be able  to download the collection file compatible with Postman.

From there you can simply follow up the instruction of the postman documentation: [Importing and exporting data](https://learning.postman.com/docs/getting-started/importing-and-exporting-data/#importing-data-into-postman)
