//Autor: Iñaki Pérez del Notario
//Libreria Total Order
//Fecha: 16-11-2020

const zmq = require('zeromq');
let sock = zmq.socket('dealer')
let events = require('events');

let eventEmitter = new events.EventEmitter();
let todeliverable = [];
let delivered = [];
let evento = 'TO_DELIVER';
let nsqi = 1;

exports.escuchador = eventEmitter;
exports.evento = evento;
//TO.escuchador.on(evento, funcion)

exports.connect = function (servidor, id) {

  sock.identity = id;
  sock.connect(servidor);
  //sock.send(['',JSON.stringify({"fuente": id})]);

  sock.on('message', function (){
  	//console.log("mensaje recibido")
	let args = Array.apply(null, arguments)// ['',msg]
    //console.log(arguments[1].toString())  
    
    let message = JSON.parse(args[1])
    let nsqm = message.ns;
    //Almaceno el mensaje
    todeliverable[nsqm] = message;
    	
	//Si el numero de secuencia coincide con el del mensaje, lo entrego
	while (todeliverable[nsqi] != undefined){
		//console.log("voy a entregar el mensaje");
		//Generar evento de Entregar Mensaje
		console.log("Entregando mensaje");
		message.op = "TO_BROADCAST";
		eventEmitter.emit(evento, message);
		delivered[nsqi] = message;
		nsqi++;	
		}
	})
};

exports.disconnect = function(){
	sock.send(['',JSON.stringify({"fuente": sock.identity, "op": "disconnect"})]);
	sock.close();
}

exports.TO_BROADCAST = function (mensaje) {
  	sock.send(['',JSON.stringify(mensaje)]);
}

/*exports.escuchar = function (funcion) {
	eventEmitter.on(evento, funcion);
}*/