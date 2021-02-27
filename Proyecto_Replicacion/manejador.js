"use strict"
const zmq = require('zeromq')
//const level = require('level')
let sock_cliente = zmq.socket('dealer')
let sock_replica = zmq.socket('dealer')
var TO = require('./TotalOrder.js')
//let db = level('./'+process.argv[3])

//argv 2: identificador del manejador
let RHid = process.argv[2]
let numReplicas = process.argv[3]
console.log(RHid)

//variables de la asignacion automatica de ip puerto 
let encontrado = false
let dir_ip = null
let dir_ip_p1 = null
let dir_ip_p2 = null
let cabecera = "tcp://"
let separador = ":"
let puerto_proxy2 = "3332"
let puerto_proxy1 = "2221"
let puerto_secuenciador = "4444" //original 1112

let eduard = "172.18.69.129"
let ander = "172.18.69.126"
let unai = "172.18.69.130"
let inaki = "172.18.69.120"

//cambiar dir_ip_1 con la  direccion ip correspondiente a la maquina
//donde se ejecute el proxy_1
//dir_ip_p1 = inaki

//cambiar dir_ip_2 con la  direccion ip correspondiente a la maquina
//donde se ejecute el proxy_2
//dir_ip_p2 = inaki

//fragmento que busca la direccion ip del manejador y construye la direccion:puerto para los sockets
//del secuenciador
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
//dir_ip = inaki
dir_ip_p1 = dir_ip
dir_ip_p2 = dir_ip

sock_cliente.identity = RHid;
sock_cliente.connect(cabecera+dir_ip_p1+separador+puerto_proxy1)
//sock_cliente.send(['',JSON.stringify({"destino":1})]);

sock_replica.identity = RHid;
sock_replica.connect(cabecera+dir_ip_p2+separador+puerto_proxy2)//poner direcciones distintas
TO.connect(cabecera+dir_ip+separador+puerto_secuenciador, RHid);

let sequenced = [];
let localseq = 1;
let lastserverseq = 1;
let mycommands = {};
let myreplies = new Set();
let ORids = new Set();

//Inicializo el número de replicas del sistema
for (let i = 1; i <= numReplicas; i++){
    ORids.add(i);
}


/*let aux1 = {"RHid" : RHid, "CMD" : '{"OP" : "1"}'};
TO.TO_BROADCAST(aux1);
let aux2 = {"RHid" : RHid, "CMD" : '{"OP" : "2"}'};
TO.TO_BROADCAST(aux2);*/

//He recibido un mensaje de un cliente
sock_cliente.on('message', function () {
    let args = Array.apply(null, arguments) // ['',msg]
    let message = JSON.parse(args[1])
    console.log("Mensaje recibido del cliente(proxy_1): ",message)
    //console.log(message);
    //message : (CLTid, seq, CMD)
    let fuente = message.CLTid;
    let cmd = message.CMD;
    let nseq = JSON.parse(cmd).seqC;
    //let id_peticion = fuente + '_' + nseq;
    if(message.destino == RHid, message.type == "REQUEST"){
        if(!EXISTE(message.CMD)){
            
            //console.log("HOLA1.1")
            let req_message = {"RHid" : RHid, "CMD" : message.CMD};
            TO.TO_BROADCAST(req_message);
            
        }
        else{
            //console.log("HOLA1.2")
            //Si ya existia, la reenvio
            let seq = Obtener_seq(message.CMD);
            

            //let req_message = {"RHid" : RHid, "CMD" : message.CMD, "seq" : seq};
            TransmitToReplicas(seq, menssage.CMD, lastserverseq)
            console.log("ESTOY EN EL ELSE")
            myreplies.add(seq);
            lastserverseq = Math.max(lastserverseq, seq);
        }
    }
});

//He recibido respuesta del secuenciador
TO.escuchador.on(TO.evento,function(mensaje) {

    console.log("He recibido respuesta del secuenciador");
    console.log(mensaje.CMD);
    //Si no existia el comando, lo creo
    if(!EXISTE(mensaje.CMD)){
        sequenced[localseq] = mensaje.CMD;
        localseq++;
    }

    console.log("Enviando a las replicas")
    //Envio el mensaje a las replicas con su secuencia asignada
    let seq = Obtener_seq(mensaje.CMD);
    TransmitToReplicas(seq, mensaje.CMD, lastserverseq);
    delete mycommands[mensaje.CMD];
    myreplies.add(seq);
    //console.log(myreplies)
    lastserverseq = Math.max(lastserverseq, seq);
});
    
//He recibido un mensaje de una replica
sock_replica.on("message", function(){
    console.log("He recibido un mensaje de alguna replica")
    let args = Array.apply(null, arguments) // ['',msg]
    let message = JSON.parse(args[1])
    let seq = message.seq
    //console.log(message)
    //console.log(myreplies)

    //console.log(message.RHid == RHid)
    //console.log(message.type == "TOReply")
    //console.log(myreplies.has(seq))
    if(message.RHid == RHid &&  message.type == "TOReply" && myreplies.has(seq)){
        //Envio respuesta al cliente
        console.log("Enviando respuesta al cliente");
        let cmd = JSON.parse(sequenced[seq]);
        console.log(cmd)
        let res_message = {"RHid" : RHid, "destino" : cmd.CLTid, "type" : "REPLY", "CMD" : cmd, "RES" : message.res};//CLTid
        console.log(res_message)
        sock_cliente.send(['',JSON.stringify(res_message)]);
        myreplies.delete(message.seq);
    }
});

function TransmitToReplicas(seq, cmd, lastserverseq){
    //Enviar mensaje a todas las replicas
    
    for (let j = lastserverseq; j < seq; j++){
        let cmdj = sequenced[j];
        for(let ORid of ORids){//Para cada replica
            let req = {"RHid" : RHid, "ORid" : ORid, "type" : "TORequest", "seq": j, "CMD" : cmdj};
            sock_replica.send([ORid,'',JSON.stringify(req)]);
        }
    }

    for(let ORid of ORids){//Para cada replica
        let req = {"RHid" : RHid, "ORid" : ORid, "type" : "TORequest", "seq": seq, "CMD" : cmd};
        sock_replica.send([ORid,'',JSON.stringify(req)]);
    }
}

function EXISTE(cmd){
    //compruebo desde el ultimo mensaje enviado al cliente, hasta el ultimo recibido del cliente
    for(let i = 1; i < localseq; i++){//revisar
        if(sequenced[i] == cmd){
            return true;
        }
    }
    return false;
}

function Obtener_seq(cmd){
    for(let i = 1; i < localseq; i++){//revisar
        if(sequenced[i] == cmd){
            return i;
        }
    }
    return -1;
}

process.on('SIGINT', function() {
    sock_cliente.close();
    sock_replica.close();
    TO.disconnect();
})
