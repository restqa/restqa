---
id: github-action
title: Github Action
parent: continuous-integration
order: 1
---

If you are hosting your tests scenario into Github, You can easily run your test automation from your own github repository.

### Github Action

If you are new to github action we are inviting you to watch this [video](https://www.youtube.com/watch?v=E1OunoCyuhY)

The installation is very simple :

2. Create a new file in your repository : `.github/workflows/restqa.yml`
3. Copy paste the informations in your `.github/workflows/restqa.yml`:

```yaml
name: E2E

on: [push]

jobs:
  RestQa:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v1
    - uses: restqa/restqa-action@0.0.1
      env:
        DISCORD_WEBHOOK: ${{secrets.DISCORD_WEBHOOK}}
        SLACK_WEBHOOK_URL: ${{secrets.SLACK_WEBHOOK_URL}}
      with:
        path: 'test/' # If your tests are located into the `test` folder
    - name: RestQA Report
      uses: actions/upload-artifact@v2
      with:
        name: restqa-report
        path: report

```

And Voila!

In order to know more about the different option from the `restqa` command line,  take a look at the [RestQA CLI](/api/cli) documentation.

The Github Action is open source feel free to take a look at it to get more detail: [restqa-action](https://github.com/restqa/restqa-action)
