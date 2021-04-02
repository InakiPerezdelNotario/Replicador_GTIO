pipeline {
  agent any
  stages {
    stage('build') {
      steps {
        sh 'ls'
        sh 'ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose'
        sh 'sudo -s'
      }
    }

  }
}