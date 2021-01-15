let workbook
let firstSheet

function Upload() {
    //Reference the FileUpload element.
    var fileUpload = document.getElementById("fileUpload");

    //Validate whether File is valid Excel file.
    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xls|.xlsx)$/;
    if (regex.test(fileUpload.value.toLowerCase())) {
        if (typeof (FileReader) != "undefined") {
            var reader = new FileReader();

            //For Browsers other than IE.
            if (reader.readAsBinaryString) {
                reader.onload = function (e) {
                    ProcessExcel(e.target.result, (excelRows) => {
                      tablahtml(excelRows)
                    })
                };
                reader.readAsBinaryString(fileUpload.files[0]);
            } else {
                //For IE Browser.
                reader.onload = function (e) {
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
    XLSX.utils.sheet_to_json(workbook.Sheets[firstSheet], {defval: "-"})
  )
}

function tablahtml(excelRows) {

  //Create a HTML Table element.
  var table = document.createElement("table");
  table.border = "2";

  //Add the header row.
  var row = table.insertRow(-1);

  //Add the header cells.
  let headerCell
  for (let i in excelRows[0]){
    headerCell = document.createElement("TH");
    headerCell.innerHTML = i;
    row.appendChild(headerCell);
  }

  const keys = Object.keys(excelRows[0]);
  for (let fila of excelRows){

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

function valor(celda) {
  return workbook.Sheets[firstSheet][celda.toUpperCase()].v;
}
