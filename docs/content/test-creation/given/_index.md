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
Given a request
Given the headers:
  | Accept-language | en |
Given the payload:
  """
  {
    "foo": "bar"
  }
  """
When POST "/welcome"
```

or using the **And** statement (recommended):

```gherkin
Given a request
  And the headers:
  | Accept-language | en |
  And the payload:
  """
  {
    "foo": "bar"
  }
  """
When POST "/welcome"
```

> As you can see the keyword **And** allows you to chain multiple **Given** Statement.


## API Request in the nutshell

The information supported to describe an API request are:

| Context | Description | Mandatory | Default |
| --- | --- | --- |  --- | 
| [Host](#/documentation/given-host) | Define the url of your request  | yes | Info from config |
| [Authorization](#/documentation/given-authorization) | Define the authorization of your request  | no | |
| [Headers](#/documentation/given-request-headers) | Define the headers of your request  | no | |
| [Query parameter](#/documentation/given-query-parameter) | Define the query parameters of your request  | no | |
| [JSON Request Body](#/documentation/given-body-json) | Define the json body of your request  | no | |
| [Form Request Body](#/documentation/given-body-form) | Define the form body of your request  | no | |
