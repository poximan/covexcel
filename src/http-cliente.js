const https = require('https');

exports.getCiudadano = () => {

  https.get('https://encrypted.google.com/', (res) => {
    console.log('statusCode:', res.statusCode);
    console.log('headers:', res.headers);

    res.on('data', (d) => {
      process.stdout.write(d);
    });

  }).on('error', (e) => {
    console.error(e);
  });

}
