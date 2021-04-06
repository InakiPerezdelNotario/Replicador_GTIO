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
        sh 'ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose'
      }
    }

  }
  environment {
    Raiz = ''
  }
}