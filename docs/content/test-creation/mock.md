---
id: mock
title: Mock external dependencies (local testing)
sidebar_label: Mocking
parent: test-creation
order: 4
---

Mock is a key part of local testing, however it's also very cumbersome to write mock within your code.
This is why RestQA aim to make this easier for you. Import the right plugin and Voila your mock is Ready.

> In order to use the Mock plugin from RestQA ensure that you are using **Environment Variable** to set the configuration of your external dependencies.

RestQA follows the [Test container](https://www.testcontainers.org/), which consist of spin up a throwaway instance of your external dependencies.

## Mocking concept

![mocking](images/documentation/mocking.png)


## Getting started

Depending on what you want to mock, we would suggest your to use one of the predifined plugin:

* [HTTP Mock](#/documentation/http-mock)
* [MongoDB Mock](#/documentation/mongodb-mock)
* [Create your own plugin](#/documentation/custom-plugin)


If you would like more plugin, feel free to open an [issue](https://github.com/restqa/restqa/issues/new/choose) we would be happy to support you.


