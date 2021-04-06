pipeline {
  environment {
        PATH = "$PATH:"
  }
  agent any
  stages {
    stage('build') {
      steps {
        sh 'ls'
        sh 'sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose'
      }
    }

  }
}
