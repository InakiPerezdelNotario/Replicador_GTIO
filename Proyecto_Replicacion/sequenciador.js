"use strict"
const zmq = require('zeromq')
let sock = zmq.socket('router')

sock.identity = 'seq';

//variables de la asignacion automatica de ip puerto 
let encontrado = false
let dir_ip = null
let cabecera = "tcp://"
let separador = ":"
let puerto ="4444"

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

//sock.bind("tcp://127.0.0.100:1112", function (err) {
sock.bind(cabecera+dir_ip+separador+puerto, function (err) {
    if (err) throw err
})

let seq = 1;
let cmds = new Array();
let nsqm = 1;
let nsqi = {};

sock.on('message', function () {
	console.log("Mensaje recibido");
	var args = Array.apply(null, arguments) // [id,'',msg]
    //console.log(args.toString()) 
    let message = JSON.parse(args[2])
    console.log(message);

    if(nsqi[message.RHid] == undefined){
    	nsqi[message.RHid] = 1;
    }

    if(message.op != "disconnect"){
		let aux = EXISTE(message.CMD);
		//console.log(aux);
		//Si el comando no existe, se devuelve una nueva secuencia
		if(aux == null){
			cmds[seq] = message.CMD;

			let aux2 = JSON.parse(message.CMD)
			aux2.seq = seq;
			message.CMD = JSON.stringify(aux2);

			let resp = {"RHid" : message.RHid, "CMD" : message.CMD, "ns" : nsqi[message.RHid]};
			sock.send([message.RHid, '', JSON.stringify(resp)]);
			console.log("respuesta enviada");
			seq++;
			nsqi[message.RHid]++;
		}
		else{
			//Si el comando ya existia, se devuelve su correspondiente secuencia
			let aux2 = JSON.parse(message.CMD)
			aux2.seq = aux;
			message.CMD = JSON.stringify(aux2);

			let resp = {"RHid" : message.RHid, "CMD" : message.CMD, "ns" : nsqi[message.RHid]};
			sock.send([message.RHid, '', JSON.stringify(resp)])
			nsqi[message.RHid]++;
		}
	}
});

function EXISTE(cmd){
	for (let i = 1; i < seq; i++){
		if(cmds[i] == cmd){
			return i;
		}
	}
	return null;
}
