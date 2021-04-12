pipeline {
  agent any
  stages {
    stage('build') {
      steps {
        sh 'ls'
        sh 'docker network create kong-net'
        sh '''docker run -d --name kong-database \\
               --network=kong-net \\
               -p 9042:9042 \\
               cassandra:3'''
        sh '''

docker-compose build

'''
        sh 'docker-compose up'
        sh 'sleep 20'
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