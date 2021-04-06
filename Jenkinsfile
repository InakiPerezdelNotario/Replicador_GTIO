pipeline {
  agent any
  stages {
    stage('build') {
      steps {
        sh 'ls'
        sh 'docker-compose up'
        sh 'echo HOLA'
      }
    }

  }
  environment {
    PATH = "$PATH:"
  }
}