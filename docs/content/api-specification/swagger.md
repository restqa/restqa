---
id: swagger
title: OAS3 API Specification
sidebar_label: Swagger (oas3)
parent: api-specification
order: 1
---

In order to generate an Open API specification nothing is more simple that add a few lines in your `.restqa.yml`.

```
specification:
  tool: swagger
```

From there RestQA will apply it magic and generate the api specification.


### Concept

Check below what is happening behind the scene.

![swagger](images/documentation/swagger.png)

### Full Example


```
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
specification:
  tool: swagger
  title: Users Product
  description: |>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vehicula nunc sodales metus consectetur posuere.
    Curabitur id viverra odio, at fermentum leo. Proin bibendum sed lectus nec sodales.
```




