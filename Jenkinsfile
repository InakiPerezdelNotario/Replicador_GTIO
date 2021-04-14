pipeline {
  agent any
  stages {
    stage('build') {
      steps {
        sh 'ls'
        sh '''

docker-compose build

'''
        sh 'docker-compose up -d --remove-orphans'
        sh 'sleep 20'
        sh '(cd Proyecto_Replicacion/ && docker-compose up -d)'
        sh 'sh inicializar.sh'
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