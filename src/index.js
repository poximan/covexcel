const http = require("http");
const { exec } = require('child_process');

const despachante = require("./despachante");
const { getCiudadano } = require("./http-cliente");

var env = process.env.NODE_ENV || 'development';
var config = require("../sensible/config")[env];

const host = config.server.host;
const port = config.server.port;

/*
------------------------------------------------------------------
*/

const requestListener = function(req, res) {

  if (req.method === 'POST') {

    let body = '';

    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {

        const ficha = JSON.parse(body)
        console.log(ficha);
        getCiudadano(ficha)

        ret = true
        res.writeHead(200)
        res.end()
    });
  }
  else
    despachante.despachar(req, res, (exito) => {
      if (!exito)
        console.log(req.url)
    })
}

const server = http.createServer(requestListener);

server.listen(port, host, () => {

  console.log(`Server is running on http://${host}:${port}`);

  exec("C:/\"Program Files\"/\"Mozilla Firefox\"/firefox.exe "+`${host}:${port}`, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
  });
});
