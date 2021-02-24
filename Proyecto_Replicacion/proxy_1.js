"use strict"
const zmq = require('zeromq')

//variables de la asignacion automatica de ip puerto 
let encontrado = false
let dir_ip = null
let cabecera = "tcp://"
let separador = ":"
let puerto_front = "1112"
let puerto_back ="2221"

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
dir_ip = "172.18.69.120"
let frontend = cabecera+dir_ip+separador+puerto_front
//let frontend = cabecera+"172.18.69.129"+separador+puerto_front
let backend = cabecera+dir_ip+separador+puerto_back
//let backend = cabecera+"172.18.69.129"+separador+puerto_back

/* 
   Creacion de los socketes correspondientes para el lado
   cliente (frontend) y lado manejador (backend)
*/
console.log(frontend)
console.log(backend)
let backRouter = zmq.socket('router')
backRouter.bind(backend, function (err) {
    if (err) throw err
})

let frontRouter = zmq.socket('router')
frontRouter.bind(frontend, function (err) {
    if (err) throw err
})

backRouter.on('message', function () {
    var args = Array.apply(null, arguments) // [id,'',msg]
    let message = JSON.parse(args[2])
    
    //console.log('Prueba origen Manej: ', message.fuente);
    console.log("Mensaje recibido del manejador: ",message)
    console.log(message.destino) 
    //console.log(message);
    frontRouter.send([message.destino, '', args[2]])
})

frontRouter.on('message', function () {
    var args = Array.apply(null, arguments)
    let message = JSON.parse(args[2])
    console.log("Mensaje recibido del cliente: ",message)
    //backRouter.send("HOLA")
    backRouter.send([message.destino, '', args[2]])
    console.log("ENVIADO")
})

process.on('SIGINT', function() {
    backRouter.close()
    frontRouter.close()
})
