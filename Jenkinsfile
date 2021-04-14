pipeline {
  agent any
  stages {
    stage('build') {
      steps {
        sh 'ls'
        sh 'sh CerrarServicios.sh'
        sh 'docker network create kong-ee-net'
        sh '''

docker-compose build

'''
        sh 'docker-compose up -d --remove-orphans'
        sh 'sleep 15'
        sh '(cd Proyecto_Replicacion/ && docker-compose up)'
        sh 'sleep 15'
      }
    }

    stage('Test') {
      steps {
        sh '''curl -i -X GET \\
  --url http://172.18.69.90:8000/ \\
  --header \'Host: replicador.com\''''
      }
    }

  }
  environment {
    PATH = "$PATH:"
  }
}