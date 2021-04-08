const http = require('http');
const { exec } = require("child_process");

const requestListener = function (req, res) {
  res.writeHead(200);
  //res.end('Hello, World!');
  exec('cd /tmp/server/; nodejs /tmp/server/cliente.js 1 1', (error, stdout, stderr) => {
	if (error) {
		console.error(`error: ${error.message}`);
		res.end('ERROR0');
		return error;
	}

	else if (stderr) {
		console.error(`stderr: ${stderr}`);
		res.end('ERROR1');
		return stderr;
	}
	else{
		console.log(`stdout:\n${stdout}`);
		res.end('TERMINADO');
		return stdout;
	}
  });
}
const server = http.createServer(requestListener);
server.listen(8080);
