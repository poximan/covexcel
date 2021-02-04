var env = process.env.NODE_ENV || 'development';
var config = require("../sensible/config")[env];
var conexion = require("../sensible/config")

const https = require('https')

exports.getCiudadano = (ficha) => {

  let ws042 = config.ws042

  const parametros = `?nrodoc=26334344&usuario=${conexion.usuario}&clave=${conexion.clave}`
  ws042 = ws042.replace("/{parametros}", parametros)

  console.log(`pregunta GET -> ${ws042}`);

  https.get(ws042, (res) => {

    res.on('data', (d) => {
      process.stdout.write(d)
    });

  }).on('error', (e) => {
    console.error(e)
  });
}
