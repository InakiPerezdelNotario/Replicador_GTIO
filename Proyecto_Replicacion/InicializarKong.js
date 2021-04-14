const { exec } = require("child_process");

//fragmento que busca la direccion ip de la maquina
const { networkInterfaces } = require('os');
const nets = networkInterfaces();
const results = Object.create(null); // or just '{}', an empty object

dir_ip = 'localhost';
encontrado = false;
for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
		//evita todas las direcciones que no sean ipv4 o la direccion interna (127.0.0.1)
        if (net.family === 'IPv4' && !net.internal && !encontrado) {
            dir_ip = net.address;
            //nos vale con la primera direccion asi que paramos
            encontrado=true
        }
    }
}

//Inicializo el servicio
  exec('curl -i -X POST \
  --url http://172.18.69.90:8001/services/ \
  --data "name=replicador" \
  --data "url=http://' + dir_ip + ':8080"', (error, stdout, stderr) => {
	if (error) {
		console.log(`error: ${error.message}`);
		console.log('ERROR0');
		return error;
	}

	else if (stderr) {
		console.log(`stderr: ${stderr}`);
		console.log('ERROR1');
		return stderr;
	}
	else{
		console.log(`stdout:\n${stdout}`);
		console.log('TERMINADO');
		return stdout;
	}
  });

//Inicializo la ruta
exec('curl -i -X POST \
  --url http://172.18.69.90:8001/services/replicador/routes \
  --data "hosts[]=replicador.com"', (error, stdout, stderr) => {
	if (error) {
		console.log(`error: ${error.message}`);
		console.log('ERROR0');
		return error;
	}

	else if (stderr) {
		console.log(`stderr: ${stderr}`);
		console.log('ERROR1');
		return stderr;
	}
	else{
		console.log(`stdout:\n${stdout}`);
		console.log('TERMINADO');
		return stdout;
	}
  });
