# Features

In order to undertand better the best way to write scenario, you should first be comfortable with cucumber. Take a look at the [cucumber documentation](https://cucumber.io/docs/gherkin/reference/). To fully understand the diifferent definition on the current page.

## Dataset

On top of adding step definition this plugin will attach extra capabilities to the dataset.


### Generate a fake data on the fly

If you have to deal with a lot of fake data, it is inconvenient for the step definition to includ in this plugin.
This is why you can generate your fake data on the fly as well. It can be use as dynamic data synthax.

As you know you can interact with the dataset using the pattern `{{ firstName }}` in order to print the `firstName` variable, and so on...
Then by using the same pattern and you attach the prefix `faker` you'll be able to access directly to the Faker library properties.

Example: 

```gherkin
Then the response body at "user.firstname" should not be equal to {{ faker.name.firstName }}
```

While `faker.name.firstName` is refering the to property `name.firstName` from the [Faker.js](https://github.com/Marak/faker.js) library. ([full list properties available](https://github.com/Marak/faker.js#api-methods))
