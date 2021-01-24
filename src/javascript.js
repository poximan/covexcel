let workbook
let firstSheet

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
      } else {
        //For IE Browser.
        reader.onload = function(e) {
          var data = "";
          var bytes = new Uint8Array(e.target.result);
          for (var i = 0; i < bytes.byteLength; i++) {
            data += String.fromCharCode(bytes[i]);
          }
          ProcessExcel(data, (excelRows) => {
            tablahtml(excelRows)
          })
        };
        reader.readAsArrayBuffer(fileUpload.files[0]);
      }
    } else {
      alert("This browser does not support HTML5.");
    }
  } else {
    alert("Please upload a valid Excel file.");
  }
};

function ProcessExcel(data, cb) {
  //Read the Excel File data.
  workbook = XLSX.read(data, {
    type: 'binary'
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

  let fila = document.getElementById("fila").value

  if (fila != '') {
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

  // datos solapa ciudadano
  let ciudadano = []
  ciudadano.push({
    nombre: "dni",
    valor: valorCelda("e" + fila) + ` (apynom: ${valorCelda("c"+fila)}, ${valorCelda("b"+fila)})`
  })
  ciudadano.push({
    nombre: "telefono",
    valor: valorCelda("j" + fila)
  })
  ciudadano.push({
    nombre: "email",
    valor: valorCelda("k" + fila)
  })
  ciudadano.push({
    nombre: "domicilio",
    valor: valorCelda("l" + fila) + ", barrio " + valorCelda("m" + fila)
  })

  const arr_nombres = valorCelda("ak" + fila).split("\n\n");
  //arr_nombres = arr_nombres.concat(valorCelda("ad" + fila).split("\n\n").filter(x => x === "Si"))
  const arr_edades = valorCelda("al" + fila).split("\n\n");
  const arr_relaciones = valorCelda("am" + fila).split("\n\n");

  if(
    (arr_nombres.length === arr_edades.length) &&
    (arr_nombres.length === arr_relaciones.length) &&
    arr_nombres[0] != ''
  ){
    for (var i = 0; i < arr_nombres.length; i++)
      ciudadano.push({
        nombre: `conviviente ${i+1} -> ${arr_relaciones[i]}`, // relacion
        valor: arr_nombres[i] + `, ${arr_edades[i]} años`
      })
  }

  const element_ciudadano = document.getElementById("ciudadano");

  element_ciudadano.innerHTML = ""
  var tag = document.createElement("h2");
  var text = document.createTextNode("Ciudadano");
  tag.appendChild(text);
  element_ciudadano.appendChild(tag);

  ciudadano.forEach(datos => {
    var tag = document.createElement("p");
    var text = document.createTextNode(datos.nombre + ": " + datos.valor);
    tag.appendChild(text);
    element_ciudadano.appendChild(tag);
  });

  // datos solapa evento
  let evento = []
  evento.push({
    nombre: "fecha papel",
    valor: valorCelda("bc" + fila)
  })
  evento.push({
    nombre: "fecha nexo",
    valor: valorCelda("af" + fila)
  })

  const element_evento = document.getElementById("evento");

  element_evento.innerHTML = ""
  var tag = document.createElement("h2");
  var text = document.createTextNode("Evento");
  tag.appendChild(text);
  element_evento.appendChild(tag);

  evento.forEach(datos => {
    var tag = document.createElement("p");
    var text = document.createTextNode(datos.nombre + ": " + datos.valor);
    tag.appendChild(text);
    element_evento.appendChild(tag);
  });

  // datos solapa clinica
  let clinica = []
  clinica.push({
    nombre: "fecha consulta",
    valor: evento[0].valor
  })
  clinica.push({
    nombre: "fecha sintomas",
    valor: valorCelda("w" + fila)
  })

  const arr_sintomas= valorCelda("u" + fila).split("\n");
  for (var i = 0; i < arr_sintomas.length; i++)
    clinica.push({
      nombre: `sintoma ${i+1}`,
      valor: arr_sintomas[i]
    })

  const arr_comorbilidades = valorCelda("x" + fila).split("\n");
  for (var i = 0; i < arr_comorbilidades.length; i++)
    clinica.push({
      nombre: `comorbilidad ${i+1}`,
      valor: arr_comorbilidades[i]
    })

  const element_clinica = document.getElementById("clinica");

  element_clinica.innerHTML = ""
  var tag = document.createElement("h2");
  var text = document.createTextNode("Clinica");
  tag.appendChild(text);
  element_clinica.appendChild(tag);

  clinica.forEach(datos => {
    var tag = document.createElement("p");
    var text = document.createTextNode(datos.nombre + ": " + datos.valor);
    tag.appendChild(text);
    element_clinica.appendChild(tag);
  });
}

function valorCelda(coordenada) {
  const celda = workbook.Sheets[firstSheet][coordenada.toUpperCase()]

  if (celda === undefined) return ""
  return celda.w.trim();
}
