"use strict"
const zmq = require('zeromq')
let sock = zmq.socket('dealer')
sock.identity = process.pid.toString()
const { exec } = require("child_process");

//variables de la asignacion automatica de ip puerto 
let encontrado = false
let dir_ip = null
let eduard = "172.18.69.129"
let ander = "172.18.69.126"
let unai = "172.18.69.130"
let inaki = "172.18.69.120"
let cabecera = "tcp://"
let separador = ":"
let puerto ="1100"
let seq = 1; 

let numManejadores = process.argv[2];
let manejadores = new Set();
//Inicializo el número de replicas del sistema
for (let i = 1; i <= numManejadores; i++){
    manejadores.add(i);
}

//fragmento que busca la direccion ip y construye la direccion:puerto para los sockets
const { networkInterfaces } = require('os');
const nets = networkInterfaces();
const results = Object.create(null); // or just '{}', an empty object

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
//dir_ip = "172.21.0.4"
//sock.connect(cabecera+dir_ip+separador+puerto) 

let dir = cabecera+dir_ip+separador+puerto
console.log(dir);
let backRouter = zmq.socket('router')
backRouter.bind(dir, function (err) {
    if (err) throw err
})

/*Cuando recibo un mensaje cualquiera, lanzo un cliente para que 
 * haga las peticiones al replicador*/
backRouter.on('message', function () {
	//console.log("HOLA");
	exec('CMD cd /tmp/server/; nodejs /tmp/server/cliente.js 1 1', (error, stdout, stderr) => {
	if (error) {
		console.error(`error: ${error.message}`);
		return error;
	}

	else if (stderr) {
		console.error(`stderr: ${stderr}`);
		return stderr;
	}
	else{
		console.log(`stdout:\n${stdout}`);
		return stdout;
	}
	
	});
});
