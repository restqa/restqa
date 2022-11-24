<a name="module_Given"></a>
All the steps related to the Fake data generation


* [Given](#module_Given)
    * _Generate_
        * [~defineVariable()](#module_Given..defineVariable)
    * _Language_
        * [~locale()](#module_Given..locale)

<a name="module_Given..defineVariable"></a>
### Given I generate a fake data for {string} and store it into the dataset as {string}
Generate a fake data and store it into the dataset in order to use it into an other step definition

**Category**: Generate  
**Example**  
```js
Given I generate a fake data for "name.firstName" and store it into the dataset as "firstName"
Given fake.data "name.lastName" => "name.lastName"
Then the response body at "user.lastname" should not be equal to {{ lastName }}
```
<a name="module_Given..locale"></a>
### Given I use the {string} language to generate fake data
Define the locale to use during the fake data generation.
List of language available [here](https://github.com/Marak/Faker.js#Localization)

**Category**: Language  
**Example**  
```js
Given I use the "fr" language to generate fake data
Given I use the "nl_BE" language to generate fake data
Given fake locale = "cz"
```
**Example** *(Placeholder from datasets)*  
```js
Given I use the {{ myLocale }} language to generate fake data
Given fake locale = {{ myLocale }}
```
