curl -i -X POST \
  --url http://172.18.69.90:8001/services/ \
  --data 'name=replicador' \
  --data 'url=http://192.168.64.3:8080'
  
curl -i -X POST \
  --url http://172.18.69.90:8001/services/replicador/routes \
  --data 'hosts[]=replicador.com'
