pipeline {
  agent any
  stages {
    stage('build') {
      steps {
        sh 'ls'
        sh '''docker run --rm \\
     --network=kong-net \\
     -e "KONG_DATABASE=postgres" \\
     -e "KONG_PG_HOST=kong-database" \\
     -e "KONG_PG_USER=kong" \\
     -e "KONG_PG_PASSWORD=kong" \\
     -e "KONG_CASSANDRA_CONTACT_POINTS=kong-database" \\
     kong:latest kong migrations bootstrap'''
        sh '''docker run --rm \\
     --network=kong-net \\
     -e "KONG_DATABASE=postgres" \\
     -e "KONG_PG_HOST=kong-database" \\
     -e "KONG_PG_USER=kong" \\
     -e "KONG_PG_PASSWORD=kong" \\
     -e "KONG_CASSANDRA_CONTACT_POINTS=kong-database" \\
     kong:latest kong migrations bootstrap'''
        sh '''docker run --rm \\
     --network=kong-net \\
     -e "KONG_DATABASE=postgres" \\
     -e "KONG_PG_HOST=kong-database" \\
     -e "KONG_PG_USER=kong" \\
     -e "KONG_PG_PASSWORD=kong" \\
     -e "KONG_CASSANDRA_CONTACT_POINTS=kong-database" \\
     kong:latest kong migrations bootstrap'''
        sh '''

docker-compose build

'''
        sh 'docker-compose up'
        sh 'sleep 20'
        sh 'sh inicializar.sh'
      }
    }

    stage('Test') {
      steps {
        sh '''curl -i -X GET \\
  --url http://localhost:8000/ \\
  --header \'Host: replicador.com\''''
      }
    }

  }
  environment {
    PATH = "$PATH:"
  }
}