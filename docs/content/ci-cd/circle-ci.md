---
id: circle-ci
title: Circle CI
parent: continuous-integration
order: 6
---

If you are hosting your test scenarios in Circle CI, you can easily run your test automation from your own GIT repository.

### Circle CI

If you are new to Circle CI, we suggest for you to watch this [video](https://www.youtube.com/watch?v=J1l-icYGyd0)

The installation is very simple :

1. Create a new file in your repository : `.circleci/config.yml`
2. Copy paste the informations in your `.circleci/config.yml`:

```yaml
version: 2.1
jobs:
  test:
    docker:
      - image: restqa/restqa
    steps:
      - checkout
      - run:
          name: Run RestQA integration test
          command: restqa run
      - store_artifacts:
          path: report

workflows:
  version: 2
  restqa:
    jobs:
      - test

```

And Voila!

In order to know more about the different option from the `restqa` command line,  you may check [RestQA CLI](/api/cli) for documentation.
