pipeline {
  agent {
    dockerfile {
      filename 'Dockerfile'
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