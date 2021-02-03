var config = {

  development: {
    server: {
      host: '127.0.0.1',
      port: '8000'
    },
    ws: {
      id: 400,
      endpoint: "https://sisadev.msal.gov.ar/sisadev/services/rest/snvs/altaEventoNominal"
    }
  },
  production: {
    server: {
      host: '127.0.0.1',
      port: '8000'
    },
    ws: {
      id: 400,
      endpoint: "https://sisa.msal.gov.ar/sisa/services/rest/snvs/altaEventoNominal"
    }
  }
}
module.exports = config;

/*
extraido de https://sisa.msal.gov.ar/sisadoc/
modulo 5.2.16: SNVS

Ejemplo de llamada:

{
  "usuario":"user",
	"clave":"pass",
	"altaEventoCasoNominal": {
    "idTipodoc": "1",
		"nrodoc": "34000222",
		"sexo": "F",
		"fechaNacimiento": "05-06-1989",
		"idGrupoEvento": "10",
		"idEvento": "77",
		"idEstablecimientoCarga": "10100212224552",
		"fechaPapel": "10-12-2019",
    "idClasificacionManualCaso": "22"
  }
}

Ejemplo de respuesta:

{
  "id_caso": 23473,
  "resultado": "OK"
}

*/
