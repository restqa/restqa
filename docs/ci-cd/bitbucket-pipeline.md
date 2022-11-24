---
id: bitbucket-pipeline
title: Bitbucket Pipeline
parent: continuous-integration
order: 3
---

If you are hosting your tests scenario into Bitbucket, You can easily run your test automation from your own Bitbucket repository.

### Bitbucket Pipeline

If you are new to bitbucket pipeline we are inviting you to watch this [video](https://www.youtube.com/watch?v=ibiusir3jaM)

The installation is very simple :

1. Enable the bitbucket pipeline into your test repository: `Repository setting > pipelines > settings > enable pipelines`
2. Create a new file in your repository : `bitbucket-pipelines.yml`
3. Copy paste the informations in your `bitbucket-pipelines.yml`:

```yaml
pipelines:
  default:
    - step:
      image: restqa/restqa
      script:
        - restqa run .
    #   - 'restqa run -c .restqa.yml .' # if you want to add arguments
      artifacts:
        - report/**
```

And Voila!

In order to know more about the different option from the `restqa` command line,  take a look at the [RestQA CLI](/api/cli) documentation



