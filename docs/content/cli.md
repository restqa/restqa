---
id: cli
title: "Cli: Available commands"
sidebar_label: 🖥 Command line
order: 4

---


## Start a new restqa project

As mentioned from the [getting started page](#/documentation/getting-started), in order to run your test automation using RestQA you will need to have a `.restqa.yml` file in your folder.

Otherwise RestQA client provides a command to pre-configure it for your project.

```bash
restqa run
```
 ---

## `restqa steps`: Available Step definition

To get the list of different steps available for your scenario creation:

### Given

```bash
restqa steps given
```

### When

```bash
restqa steps when
```
### Then

```bash
restqa steps then
```

Example: 

![cli steps example](images/documentation/restqa-steps.gif)


There are options available:

| Parameter  | Alias | Description                                                  | Default                           | 
| ---------- | ----- | ------------------------------------------------------------ | --------------------------------- |
| ` --tag`   | `-t`  | Filter the step to a specific keyword                        |                                   |
| `--config` | `-c`  | Specify the configuration file to use                        | `.restqa.yml`                     |

--- 
## `restqa run` : Run the test

You can run the test by using the command:

```bash
restqa run
```

or  

```bash
restqa r
```

A few options are available:

| Parameter   | Alias | Description                                                  | Default                           | 
| ----------- | ----- | ------------------------------------------------------------ | --------------------------------- |
| `--config`  | `-c` | Specify the configuration file to use                         | `.restqa.yml`                     |
| ` --env`    | `-e` | Specify the environement to pick from the configuration file  | Default environment in the config |
| ` --tag`    | `-t` | Specify the tag to pre-select features or scenarios           |                                   |
| ` --report` | `-r` | Define if you need the html report to be generated            |                                   |


---

## `restqa generate` :  Generate Scenario (curl)

If your API is already developed and you want a test scenario to check the non-regression, the best is just to generate a scenario from your curl command.

Usage: 

```bash
restqa generate curl https://jsonplaceholder.typicode.com/todos/1
```

Output (console):

```gherkin
Given a request
When GET "/todos/1"
Then status = 200
  And the body:
  """
{
  "userId": 1,
  "id": 1,
  "title": "delectus aut autem",
  "completed": false
}
  """
```

If you want to export the content into a file, you need to use the `-o` option.

To export the generated scenario into the file Generated Scenario into the `generated.feature`

```bash
restqa generate  curl https://jsonplaceholder.typicode.com/todos/1 -o generated.feature
```

---

## `restqa telemetry` : Telemetry

The telemetry options can be enabled or disabled as you wishes.

Enable the telemetry:

```bash
restqa telemetry on
```

Disable the telemetry:

```bash
restqa telemetry off
```

---

## Environement variable

In order to override some options, you can use the environment variables below:

* `RESTQA_TELEMETRY`: enable or disable the telemetry (value: on | off)
* `RESTQA_CONFIG`: Define the location of the `.restqa.yml` configuration file
* `RESTQA_ENV`: Define the environement to select withing the `.restqa.yml`
