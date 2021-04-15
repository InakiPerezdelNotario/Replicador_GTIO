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
        sh '(cd Proyecto_Replicacion/ && docker-compose build)'
        sh '(cd Proyecto_Replicacion/ && docker-compose up -d)'
        sh 'sleep 15'
      }
    }

    stage('Test') {
      steps {
        sh 'bash testReplicador.sh'
      }
    }

  }
  environment {
    PATH = "$PATH:"
  }
}