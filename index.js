const http = require("http");
const despachante = require("./despachante");
const { exec } = require('child_process');

const host = '0.0.0.0';
const port = 8000;

const requestListener = function(req, res) {

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
