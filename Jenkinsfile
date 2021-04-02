pipeline {
  agent {
    docker {
      image 'simplehttpserver'
    }

  }
  stages {
    stage('build') {
      steps {
        sh 'ls'
        sh 'docker-compose up'
      }
    }

  }
  environment {
    Raiz = ''
  }
}