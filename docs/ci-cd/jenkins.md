---
id: jenkins
title: Jenkins
parent: continuous-integration
order: 4
---

If you are plan to use Jenkins as your continuous integration tool. 

### Jenkins Pipeline

If you are new to Jenkins pipeline we are inviting you to watch this [video](https://www.youtube.com/watch?v=7KCS70sCoK0)

The installation is very simple :

1. Create a new file in your repository : `Jenkinsfile`
2. Copy paste the informations in your `Jenkinsfile`:

```groovy
pipeline {
    agent { label 'master' }

    stages {
        stage('RestQA') {
            steps {
                script {
                    sh "docker run -v ${env.WORKSPACE}:/app restqa/restqa"
                    
                    archiveArtifacts artifacts: 'report/'
                }
            }
        }
    }
}
```

> The current pipeline is based on the RestQA docker image, then you will need have docker cli available in you jenkins job.

And Voila!

In order to know more about the different option from the `restqa` command line,  take a look at the [RestQA CLI](/api/cli) documentation



