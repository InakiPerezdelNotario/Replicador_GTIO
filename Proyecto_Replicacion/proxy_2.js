"use strict"
const zmq = require('zeromq')

//variables de la asignacion automatica de ip puerto 
let encontrado = false
let dir_ip = null
let cabecera = "tcp://"
let separador = ":"
let puerto_front = "3332"
let puerto_back ="7223"

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

let frontend = cabecera+dir_ip+separador+puerto_front
let backend = cabecera+dir_ip+separador+puerto_back

let backRouter = zmq.socket('router')
console.log(frontend)
console.log(backend)
backRouter.bind(backend, function (err) {
    if (err) throw err
})

let frontRouter = zmq.socket('router')
frontRouter.bind(frontend, function (err) {
    if (err) throw err
})

//He recibido un mensaje de la replica
backRouter.on('message', function () {
    var args = Array.apply(null, arguments) // [id,'',msg]
    console.log(args.toString()) 
    let message = JSON.parse(args[2])
    frontRouter.send([message.RHid, '', args[2]])

})

//He recibido un mensaje del manejador
frontRouter.on('message', function () {
    var args = Array.apply(null, arguments)
    let message = JSON.parse(args[3])
    console.log(message);
    backRouter.send([message.ORid, '', args[3]])
})

process.on('SIGINT', function() {
    backRouter.close()
    frontRouter.close()
})
