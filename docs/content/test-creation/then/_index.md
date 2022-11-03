---
id: then
title: Then - Check your API Response
sidebar_label: API Response (Then)
parent: test-creation
order: 3
---

Once your API has been triggered, you can now checking if the API response has the expected information.

Ghekin is using the keyword **Then** in order to validate the expected assertion.

RestQA comes will a multiple pre-defined **Then** Step definition, allowing you to describe your API Response assertion just in a few seconds.

### Example:


Here an API Response:

```http
Response status code: 200
Response headers: content-Type :application/json; charset=utf-8
Response body:
{
    "foo": "bar"
}
```

In order to translate it using the RestQA Gherkin **Then** statement, we would have:

```gherkin
Then I should receive a response with the status 200
Then the header "content-Type" should be "application/json; charset=utf-8"
Then the response body at "foo" should equal "bar"
```

or using the **And** statement (recommended):

```gherkin
Then I should receive a response with the status 200
  And  the header "content-Type" should be "application/json; charset=utf-8"
  And  the response body at "foo" should equal "bar"
```

> As you can see the keyword **And** allows you to chain multiple **Then** Statement.


## API Response in the nutshell

The information supported to describe an API Response assertion are:


| Context | Description | Mandatory |
| --- | --- | --- |
| [HTTP Status](#/documentation/then-status) | Define the url of your request  | no |
| [Latency](#/documentation/then-latency) | Define the url of your request  | no |
| [Headers](#/documentation/then-headers) | Define the url of your request  | no |
| [JSON Body](#/documentation/then-response-json) | Define the url of your request  | no |
| [Sort numeric](#/documentation/then-sort-numeric) | Define the url of your request  | no |
| [Date](#/documentation/then-date) | Define the url of your request  | no |
| [Dataset](#/documentation/then-dataset) | Define the url of your request  | no |
| [Contract Validation](#/documentation/then-validation) | Define the url of your request  | no |
| [Cookie](#/documentation/then-cookie) | Define the url of your request  | no |

