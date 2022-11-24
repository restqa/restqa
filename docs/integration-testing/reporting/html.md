---
id: html
title: Html (default)
parent: reporting
---

Setting the **HTML** test report is very simple and this report allows you to visualize your test result locally.

## Example

![HTML example](../assets/cucumber-export-html.png)

:::note
 ⚡️This report is enabled by default when you are using the command `restqa init` to setup your project.
:::

## Pre-requisite

 * 1 minute  🚀
 * Valid RestQA configuration file

## Configuration 

```yaml
tests:
  integrations:
  - name: sandbox
    outputs:
      - type: 'html'
        enabled: true
        config: 
          path: 'reports'
```

## Command 

If you don't want configure this part manually you can also use the command line:

```
restqa install html
```

### Options

| *Property*   | *Description*                                                                                | *Default*          |
|:-------------|:---------------------------------------------------------------------------------------------|:-------------------|
| `path`       | The location of the report folder                                                            | ./report           |


