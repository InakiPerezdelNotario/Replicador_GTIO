expected=$"TERMINADO"
response=$(curl -i -X GET   --url http://172.18.69.90:8000/   --header 'Host: replicador.com');
value=$(echo $response | tail -c10);
echo "$response"
#echo "$value"
#echo "$expected"
if [ "$expected" == "$value" ]; then 
	echo "TEST EXITOSO"
	exit 0 
else
	echo "TEST FALLIDO"
	exit 1
fi;
