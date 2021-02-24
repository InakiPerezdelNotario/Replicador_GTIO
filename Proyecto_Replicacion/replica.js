//////////////////////////////////////////
// Autor: Unai Javier Fernández Ortega  //
// Fecha de creación: 28/10/2020		//
//////////////////////////////////////////

"use strict"
const zmq = require('zeromq')		//Invocamos la libreria ZMQ
let sock = zmq.socket('dealer')		//Creamos el socket que se comunicará con el proxy

sock.identity = process.argv[2]			//Le asignamos el ID a la replica

//variables de la asignacion automatica de ip puerto 
let encontrado = false
let dir_ip = null
let cabecera = "tcp://"
let separador = ":"
let puerto ="7223"

let eduard = "172.18.69.129"
let ander = "172.18.69.126"
let unai = "172.18.69.130"
let inaki = "172.18.69.120"

//especificar la direccion ip del proxy_2
dir_ip=inaki

sock.connect(cabecera+dir_ip+separador+puerto)//Conectamos el socket al proxy 
//sock.send(['', JSON.stringify({"fuente": sock.identity, "OP": "HOLA"})]);

//ATRIBUTOS
let toExecute = new Array()	//VectorS de operaciones a la espera de ejecutarse
let executed = new Array() //Vector de operaciones finalizadas
let expectSeq = 1 //Primera posición nula de toExecute

//En caso de que nos llegue un mensaje
sock.on('message', function () {
	console.log("HE RECIBIDO UN MENSAJE");
    let args = Array.apply(null, arguments) // ['',msg]
    let message = JSON.parse(args[1])		//Obtenemos el mensaje
    console.log(message)
	//Extraemos de el los atributos
	let dest = message.ORid
	let type = message.type
	let source = message.RHid
	let cmd = message.CMD
	console.log("cmd : " + cmd)
	let seq = JSON.parse(cmd).seq
	//console.log("ABCDEFG")
	//let TORequest = message.TOREQUEST
	console.log(type);
		//Si el mensaje es para nosotros y es el momento de ejecutarlo se procesa, sino se ignora
	if(type == "TORequest"){//dest == sock.identity && 
		console.log("Procesando operacion");
		//En caso de que sea el esperado

		//Hacerlo en un while
		if(expectSeq == seq){
			toExecute[seq] = {"RHid": source, "CMD": cmd}
			while(toExecute[expectSeq] != undefined){
				let rhid = toExecute[seq].RHid
				let cmd = toExecute[seq].CMD
				
				let res = "Patata"
				
				executed[expectSeq] = {"CMD": cmd, "res": res}
				let mensaje = {"ORid": sock.identity, "RHid": rhid, "type": "TOReply", "seq": message.seq, "res": res}
				console.log(mensaje)
				//console.log([parseInt(rhid),'', JSON.stringify(mensaje)]);
				sock.send([parseInt(rhid), JSON.stringify(mensaje)])
				
				expectSeq++
			}
		}
		
		//En caso de ir adelantado se almacena pero no se envia aun
		else if(expectSeq < seq){
			toExecute[seq] = [source, cmd]
		}
		
		//En caso de ir atrasado se envia 
		else if(expectSeq > seq){//Los mensajes se envian por duplicado
			let cmd = executed[seq].cmd
			let res = executed[seq].res
			let mensaje = {"ORid" : sock.identity, "RHid": message.RHid, "type": "TOReply", "seq": message.seq, "res": res}
			console.log(mensaje)
			sock.send([parseInt(message.RHid), JSON.stringify(mensaje)])
		}

		
		
	}else{
		//Ignoramos el mensaje
	}
  
})


process.on('SIGINT', function() {
    sock.close()
})
