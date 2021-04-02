pipeline {
  agent any
  stages {
    stage('build') {
      steps {
        sh 'ls'
        sh 'sudo -s'
        sh 'ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose'
      }
    }

  }
}