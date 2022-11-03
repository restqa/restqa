---
id: given
title: "Given: Describe your API Request"
sidebar_label: API Request (Given)
parent: test-creation
order: 1
---

In order to describe your context, the Gherkin language is providing the keywork **Given**.
While trying to test a microservice the context will represented by the API request.

RestQA comes will a multiple pre-defined **Given** Step definition, allowing you to describe your API request just in a few seconds.

### Example:


Here an API Request:

```http
HTTP Method: POST
URL: /welcome
Request headers: Accept-language: en
Request body:
{
    "foo": "bar"
}
```

In order to translate it using the RestQA Gherkin **GIVEN** statement, we would have:

```gherkin
Given I have the api gateway
Given I have the path "/welcome"
Given I have the method "POST"
Given the header contains "Accept-language" as "en"
Given the payload contains "foo" as "bar"
```

or using the **And** statement (recommended):

```gherkin
Given I have the api gateway
  And I have the path "/welcome"
  And I have the method "POST"
  And the header contains "Accept-language" as "en"
  And the payload contains "foo" as "bar"
```

> As you can see the keyword **And** allows you to chain multiple **Given** Statement.


## API Request in the nutshell

The information supported to describe an API request are:


| Context | Description | Mandatory | Default |
| --- | --- | --- |  --- | 
| [Host](#/documentation/given-host) | Define the url of your request  | yes | Info from config |
| [Path](#/documentation/given-path) | Define the path of your request  | yes | `/` |
| [Method](#/documentation/given-method) | Define the method of your request  | no | `GET`
| [Authorization](#/documentation/given-authorization) | Define the authorization of your request  | no | |
| [Headers](#/documentation/given-request-headers) | Define the headers of your request  | no | |
| [Query parameter](#/documentation/given-query-parameter) | Define the query parameters of your request  | no | |
| [JSON Request Body](#/documentation/given-body-json) | Define the json body of your request  | no | |
| [Form Request Body](#/documentation/given-body-form) | Define the form body of your request  | no | |
