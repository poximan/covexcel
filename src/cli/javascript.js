let workbook
let firstSheet

const SIN_DATO = "SIN_DATO"
const COLUMNAS = ["ciudadano","evento","clinica","epidemiologia"]

function Upload() {
  //Reference the FileUpload element.
  var fileUpload = document.getElementById("fileUpload");

  //Validate whether File is valid Excel file.
  var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xls|.xlsx)$/;
  if (regex.test(fileUpload.value.toLowerCase())) {
    if (typeof(FileReader) != "undefined") {
      var reader = new FileReader();

      //For Browsers other than IE.
      if (reader.readAsBinaryString) {
        reader.onload = function(e) {
          ProcessExcel(e.target.result, (excelRows) => {
            tablahtml(excelRows)
          })
        };
        reader.readAsBinaryString(fileUpload.files[0]);
      }
    } else {
      alert("Este navegador no soporta HTML5.");
    }
  } else {
    alert("Por favor cargue una planilla valida.");
  }
};

function ProcessExcel(data, cb) {
  //Read the Excel File data.
  workbook = XLSX.read(data, {
    type: 'binary',
    dateNF: "DD-MM-YYYY"
  });
  //Fetch the name of First Sheet.
  firstSheet = workbook.SheetNames[0];

  //Read all rows from First Sheet into an JSON array.
  cb(
    XLSX.utils.sheet_to_json(workbook.Sheets[firstSheet], {
      defval: "-"
    })
  )
}

function tablahtml(excelRows) {

  limpiarColumnas()

  let fila = document.getElementById("fila").value

  if (fila != '' && fila > 1) {
    if (fila >= 2) fila -= 2
    else fila = 0

    excelRows = [].concat(excelRows[fila])
    cargarColumnas(fila + 2)
  }

  //Create a HTML Table element.
  var table = document.createElement("table");
  table.border = "2";

  //Add the header row.
  var row = table.insertRow(-1);

  //Add the header cells.
  let headerCell
  for (let i in excelRows[0]) {
    headerCell = document.createElement("TH");
    headerCell.innerHTML = i;
    row.appendChild(headerCell);
  }

  const keys = Object.keys(excelRows[0]);
  for (let fila of excelRows) {

    //Add the data row.
    let row = table.insertRow(-1);

    //Add the data cells.
    let cell
    for (let celda of keys) {
      cell = row.insertCell(-1);
      cell.innerHTML = fila[celda];
    }
  }

  var dvExcel = document.getElementById("dvExcel");
  dvExcel.innerHTML = "";
  dvExcel.appendChild(table);
};

function cargarColumnas(fila) {

  const ciudadano = datosCiudadano(fila)
  cargarDatos(ciudadano, COLUMNAS[0])

  const evento = datosEvento(fila)
  cargarDatos(evento, COLUMNAS[1])

  const clinica = datosClinica(fila)
  cargarDatos(clinica, COLUMNAS[2])

  const epidemiologia = datosEpidemiologia(fila)
  cargarDatos(epidemiologia, COLUMNAS[3])
}

function datosCiudadano(fila) {

  let datos = []
  datos.push({
    nombre: "dni",
    valor: valorCelda("e" + fila) + ` (apynom: ${valorCelda("c"+fila)}, ${valorCelda("b"+fila)})`
  })
  datos.push({
    nombre: "telefono",
    valor: valorCelda("j" + fila)
  })
  datos.push({
    nombre: "email",
    valor: valorCelda("k" + fila)
  })
  datos.push({
    nombre: "domicilio",
    valor: valorCelda("l" + fila) + ", barrio " + valorCelda("m" + fila)
  })

  const arr_nombres = valorCelda("ak" + fila).split("\r\n\r\n");
  //arr_nombres = arr_nombres.concat(valorCelda("ad" + fila).split("\n\n").filter(x => x === "Si"))
  const arr_edades = valorCelda("al" + fila).split("\r\n\r\n");
  const arr_relaciones = valorCelda("am" + fila).split("\r\n\r\n");

  if(
    (arr_nombres.length === arr_edades.length) &&
    (arr_nombres.length === arr_relaciones.length) &&
    arr_nombres[0] != ''
  ){
    for (var i = 0; i < arr_nombres.length; i++){
      datos.push({
        nombre: `conviv.${i+1} -> ${arr_relaciones[i]}`, // relacion
        valor: arr_nombres[i] + `, ${arr_edades[i]} años`
      })
    }
  }
  return datos
}

function datosEvento(fila) {

  let datos = []
  datos.push({
    nombre: "fecha papel",
    valor: valorCeldaFecha("bc" + fila)
  })
  datos.push({
    nombre: "fecha nexo",
    valor: valorCeldaFecha("af" + fila)
  })
  datos.push({
    nombre: "¿contacto COVID+ ult.15 dias?",
    valor: (valorCelda("ac" + fila) === "Si")? "si" : "no. comunitario"
  })
  return datos
}

function datosClinica(fila) {

  let datos = []
  datos.push({
    nombre: "fecha consulta",
    valor: valorCeldaFecha("bc" + fila)
  })
  datos.push({
    nombre: "fecha sintomas",
    valor: valorCeldaFecha("w" + fila)
  })

  const arr_sintomas= valorCelda("u" + fila).split("\n");
  for (var i = 0; i < arr_sintomas.length; i++)
    datos.push({
      nombre: `sint.${i+1}`,
      valor: arr_sintomas[i]
    })

  const arr_comorbilidades = valorCelda("x" + fila).split("\n");
  for (var i = 0; i < arr_comorbilidades.length; i++){
    datos.push({
      nombre: `comorb.${i+1}`,
      valor: arr_comorbilidades[i]
    })
  }
  return datos
}

function datosEpidemiologia(fila) {

  let datos = []
  datos.push({
    nombre: "ocupacion",
    valor: (valorCelda("ao" + fila) === "Si")? valorCelda("ap" + fila) + " - " + valorCelda("ar" + fila) : "no"
  })
  datos.push({
    nombre: "¿viajo 15 dias FIS?",
    valor: valorCeldaFecha("ab" + fila)
  })
  datos.push({
    nombre: "¿convivie con contacto COVID+?",
    valor: valorCelda("ag" + fila)
  })
  return datos
}

let limpiarColumnas = () => {

  COLUMNAS.forEach(titulo => {
    const element = document.getElementById(titulo);
    element.innerHTML = "";
    var tag = document.createElement("h2");
    var text = document.createTextNode(letraCapital(titulo));
    tag.appendChild(text);
    element.appendChild(tag);
  });
}

let letraCapital = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

let cargarDatos = (datos, columna) => {

  const element = document.getElementById(columna);

  datos.forEach(dato => {
    var tag = document.createElement("p");
    var text = document.createTextNode(dato.nombre + ": " + dato.valor);
    tag.appendChild(text);
    element.appendChild(tag);
  });
}

let valorCelda = (coordenada) => {
  const celda = workbook.Sheets[firstSheet][coordenada.toUpperCase()]

  if (celda === undefined) { return SIN_DATO }
  else {
    if (celda.w.trim() === "") { return SIN_DATO }
  }

  if(/^\d{1}\..*(\+\d{2})$/.test(celda.w))
    return celda.v

  return celda.w.trim();
}

let valorCeldaFecha = (coordenada) => {

  const formato_comun = valorCelda(coordenada)

  // onda 14/01/2021 -> sigue como viene
  if(/^\d{2}-\d{2}-\d{4}$/.test(formato_comun))
    return formato_comun

  // onda 19:32:12 14 Jan, 2021 -> recuperar lo util
  if(/^\d{2}:\d{2}:\d{2} \d{2} \w{3}, \d{4}$/.test(formato_comun)){
    var date = new Date(formato_comun);
    var options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    let super_formato = date.toLocaleDateString('es-ES', options)
    const regex = /\//g;
    return super_formato.replace(regex, '-')
  }

  // onda 2020/12/31 -> darlo vuelta
  const una_sola_fecha = formato_comun.substring(0,10)
  if(/^\d{4}-\d{2}-\d{2}$/.test(una_sola_fecha))
    return una_sola_fecha.substring(8) + "-" + una_sola_fecha.substring(5,7) + "-" + una_sola_fecha.substring(0,4)

  // sale con SIN_DATO
  return formato_comun
}
