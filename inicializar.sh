curl -i -X POST \
  --url http://localhost:8001/services/ \
  --data 'name=replicador' \
  --data 'url=http://172.25.0.3:8080'
  
curl -i -X POST \
  --url http://localhost:8001/services/replicador/routes \
  --data 'hosts[]=replicador.com'