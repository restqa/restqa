---
id: travis-ci
title: Travis CI
parent: continuous-integration
order: 5
---

If you are hosting your tests scenario into Travis CI, You can easily run your test automation from your own git repository.

### Travis CI

If you are new to Travis CI we are inviting you to take a look at their [tutorial](https://docs.travis-ci.com/user/tutorial/)

The installation is very simple :

1. Create a new file in your repository : `.travis.yml`
2. Copy paste the informations in your `.travis.yml`:

```yaml
dist: trusty

jobs:
  include:
  - stage: test
    script: docker run --rm -v $PWD:/app restqa/restqa

```

And Voila!

In order to know more about the different option from the `restqa` command line,  take a look at the [RestQA CLI](/api/cli) documentation
