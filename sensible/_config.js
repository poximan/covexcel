var config = {
  usuario: ...,
  clave: ...,
  development: {
    server: {
      host: '127.0.0.1',
      port: '8000'
    },
    ws400: "https://sisadev.msal.gov.ar/sisadev/services/rest/snvs/altaEventoNominal",
    ws042: "https://sisadev.msal.gov.ar/sisadev/services/rest/cmdb/obtener/{parametros}"
  },
  production: {
    server: {
      host: '127.0.0.1',
      port: '8000'
    },
    ws400: "https://sisa.msal.gov.ar/sisa/services/rest/snvs/altaEventoNominal",
    ws042: "https://sisa.msal.gov.ar/sisa/services/rest/cmdb/obtener/{parametros}"
  }
}
module.exports = config;

/*
extraido de https://sisa.msal.gov.ar/sisadoc/
modulo 5.2.2: RENAPER
modulo 5.2.16: SNVS
*/
