---
id: installation
title: Installation
parent: getting-started
order: 1

---

### Pre requisite

In order to run you will to have :

* NodeJs installed
* Npm or Yarn installed

## Install with npm

To install RestQA globally, run the command:

```bash
npm install @restqa/restqa -g
```

Then you can chek your install:

```bash
restqa --version
```

## Give RestQA a spin without install

### Using NPX

To spin up RestQA without installing it, you can run:

```bash
npx @restqa/restqa --version
```



### Using DOCKER

To play around with RestQA, you can also start it using Docker:

```bash
docker run -it --rm \
  --name restqa \
  -v $PWD:/app \
  restqa/restqa --version
```

As you can see you will need to mount your current folder into the container location `/app`.
