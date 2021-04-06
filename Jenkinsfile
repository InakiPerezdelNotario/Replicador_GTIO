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
        sh 'docker-compose up'
        sh 'cd /var/jenkins_home/workspace/Replicador_GTIO_main'
      }
    }

  }
  environment {
    Raiz = ''
  }
}