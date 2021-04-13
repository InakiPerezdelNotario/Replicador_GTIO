pipeline {
  agent any
  stages {
    stage('build') {
      steps {
        sh 'ls'
        sh '''

docker-compose build

'''
        sh 'docker-compose up -d'
        sh 'sleep 20'
        sh '(cd Proyecto_Replicacion/ && docker-compose up)'
        sh 'sh inicializar.sh'
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