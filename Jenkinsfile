pipeline {
  agent any
  stages {
    stage('build') {
      steps {
        sh 'ls'
        sh '''

docker-compose build

'''
        sh 'docker-compose up'
        sh 'sleep 20'
        sh 'sh inicializar.sh'
        sh 'echo "ESTE ECHO NO SE IMPRIMIRA NUNCA, JAJAJAJAJA"'
      }
    }

    stage('Test') {
      steps {
        sh '''curl -i -X GET \\
  --url http://localhost:8000/ \\
  --header \'Host: replicador.com\''''
      }
    }

  }
  environment {
    PATH = "$PATH:"
  }
}