---
id: gitlab-ci
title: Gitlab CI
parent: continuous-integration
order: 2
---

If you are hosting your tests scenario into Gitlab, You can easily run your test automation from your own Gitlab repository.

### Gitlab CI

If you are new to gitlab CI we are inviting you to watch this [video](https://youtu.be/1iXFbchozdY)

The installation is very simple :

1. Create a new file in your repository : `.gitlab-ci.yml`
2. Copy paste the informations in your `.gitlab-ci.yml`:

```yaml
stages:
  - e2e-test

RestQa:
  stage: e2e-test
  image:
    name: 'restqa/restqa'
  script:
    - 'restqa run .'
#   - 'restqa run -c .restqa.yml .' # if you want to add arguments
  artifacts:
    paths:
    - report
```

And Voila!

In order to know more about the different option from the `restqa` command line,  take a look at the [RestQA CLI](/api/cli) documentation
