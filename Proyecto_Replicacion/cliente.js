"use strict"
const zmq = require('zeromq')
let sock = zmq.socket('dealer')
sock.identity = process.pid.toString()

//variables de la asignacion automatica de ip puerto 
let encontrado = false
let dir_ip = null
let eduard = "172.18.69.129"
let ander = "172.18.69.126"
let unai = "172.18.69.130"
let inaki = "172.18.69.120"
let cabecera = "tcp://"
let separador = ":"
let puerto ="1112"
let seq = 1; 

let numManejadores = process.argv[2];
let manejadores = new Set();
//Inicializo el número de replicas del sistema
for (let i = 1; i <= numManejadores; i++){
    manejadores.add(i);
}

//cambiar dir_ip con la  direccion ip correspondiente a la maquina
//donde se ejecute el proxy_1git
dir_ip = "172.19.0.2"
sock.connect(cabecera+dir_ip+separador+puerto) 

let timeout = 300;
let booleans = {};
let recibidos = new Set()
let tiempo;
let sumTiempo = 0;
let maxi = 1000;
let i = 0;
//getFromServer(process.argv[2],process.argv[3],process.argv[4]) 

sock.on('message', function () {
    let args = Array.apply(null, arguments)// ['',msg]
    //console.log(arguments[1].toString())    
    let message = JSON.parse(args[1])
    let cmd = message.CMD

    if (!recibidos.has(seq)){
    	console.log("HE RECIBIDO RESPUESTA")
    	recibidos.add(seq)
    	console.log(arguments[1].toString())
    	let auxt = Date.now() - tiempo
    	sumTiempo += auxt;
    	console.log("Tiempo de respuesta : " + auxt)
    	if (i < maxi){
    		setTimeout(function(){getFromServer(Select(),2)}, 1)
    		i++;
    	}
        else{
            console.log("Tiempo Medio de respuesta : " + sumTiempo / recibidos.size);
        }
    }
    booleans[message.CMD.seqC] = true
    
})


getFromServer(Select(),2)

//console.log(Select());

function timeoutexecute(num, op){
	if(!booleans[num]){
		console.log("Timeout excedido, enviando otra peticion")
		//Reenvio el mensaje de nuevo, ya que no he obtenido respuesta
		let cmd = '{"CLTid": ' + sock.identity + ', "OP" : "' + op + '", "seqC" : ' + num +'}'
	    let message = {'destino': Select(), 'type': 'REQUEST', 'CMD': cmd }
	    //console.log(message)
	    sock.send(['', JSON.stringify(message)])
	    setTimeout(function(){timeoutexecute(num,op)},timeout)

	}
}

function getFromServer(manejador, op) {
	let cmd = '{"CLTid": ' + sock.identity + ', "OP" : "' + op + '", "seqC" : ' + seq +'}'
	
    let message = {'destino': manejador, 'type': 'REQUEST', 'CMD': cmd }
    console.log(message)
    sock.send(['', JSON.stringify(message)])
    booleans[seq] = false
    let miseq = seq
    tiempo = Date.now()
    setTimeout(function(){timeoutexecute(miseq, op)},timeout)
    seq++;
}

process.on('SIGINT', function() {
    console.log("Tiempo Medio de respuesta : " + sumTiempo / recibidos.size)
    sock.close()
})

function Select(){
	return parseInt(Math.random() * numManejadores + 1);
}
