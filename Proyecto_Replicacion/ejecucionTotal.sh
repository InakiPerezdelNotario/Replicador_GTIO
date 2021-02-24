x-terminal-emulator -T secuenciador -e nodejs sequenciador.js 
x-terminal-emulator -T replica_1 -e nodejs replica.js 1 
x-terminal-emulator -T replica_2 -e nodejs replica.js 2 
x-terminal-emulator -T Manejador_1 -e nodejs manejador.js 1 2 
x-terminal-emulator -T Manejador_2 -e nodejs manejador.js 2 2 
x-terminal-emulator -T Manejador_1 -e nodejs manejador.js 3 2 
x-terminal-emulator -T Manejador_2 -e nodejs manejador.js 4 2 