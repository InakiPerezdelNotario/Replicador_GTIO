pipeline {
  agent any
  stages {
    stage('build') {
      steps {
        sh 'ls'
        sh '''

docker-compose build

'''
        sh '''docker-compose up &


































'''
        sh 'sleep 20'
        sh 'sh inicializar.sh'
      }
    }

  }
  environment {
    PATH = "$PATH:"
  }
}