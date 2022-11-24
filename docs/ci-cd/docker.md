---
id: docker
title: Docker
parent: continuous-integration
order: 7
---

If you are using your own Continuous Integration tool such as Jenkins, GoCd, Argo, etc...  We recommend you to use run RestQa within a docker container.

It's very simple, just run the command :

```
docker run -it --rm -v $PWD:/app restqa/restqa restqa run -e dev tests/
```

And Voila!

The documentation about the RestQA container is available on [Docker Hub](https://hub.docker.com/repository/docker/restqa/restqa)

In order to know more about the different option from the `restqa` command line,  take a look at the [RestQA CLI](/api/cli) documentation

