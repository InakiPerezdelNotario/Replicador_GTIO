pipeline {
  agent any
  stages {
    stage('build') {
      steps {
        sh 'ls'
        sh 'docker stop replicador_gtio_main_replicador_1'
        sh 'docker stop replicador_gtio_kong_1'
        sh 'docker stop replicador_gtio_main_db_1'
        sh '''

docker-compose build

'''
        sh 'docker-compose up'
        sh 'sleep 20'
        sh 'sh inicializar.sh'
      }
    }

  }
  environment {
    PATH = "$PATH:"
  }
}