const fs = require('fs').promises;

/*
------------------------------------------------------------------
*/

let ret = false

exports.despachar = (req, res, cb) => {

  ret = false

  if (req.url === '/') {

    ret = true

    fs.readFile(__dirname + "/cli/index.html")
    .then(contents => {
      res.setHeader("Content-Type", "text/html")
      res.writeHead(200)
      res.end(contents)
    })
    .catch(err => {
      res.writeHead(500)
      res.end(err)
      return
    });
  }

  if (req.url === '/cli/javascript.js') {

    ret = true

    fs.readFile(__dirname + "/cli/javascript.js")
    .then(contents => {
      res.setHeader("Content-Type", "application/javascript")
      res.writeHead(200)
      res.end(contents)
    })
    .catch(err => {
      res.writeHead(500)
      res.end(err)
      return
    });
  }

  if (req.url === '/cli/styles.css') {

    ret = true

    fs.readFile(__dirname + "/cli/styles.css")
    .then(contents => {
      res.setHeader("Content-Type", "text/css")
      res.writeHead(200)
      res.end(contents)
    })
    .catch(err => {
      res.writeHead(500)
      res.end(err)
      return
    });
  }

  if (req.url === '/cli/xlsx.full.min.js') {

    ret = true

    fs.readFile(__dirname + "/cli/xlsx.full.min.js")
    .then(contents => {
      res.setHeader("Content-Type", "application/javascript")
      res.writeHead(200)
      res.end(contents)
    })
    .catch(err => {
      res.writeHead(500)
      res.end(err)
      return
    });
  }

  if (req.url === '/favicon.ico') {

    ret = true

    fs.readFile(__dirname + "/img/chubut.jpg")
    .then(contents => {
      res.setHeader("Content-Type", "image/jpeg")
      res.writeHead(200)
      res.end(contents)
    })
    .catch(err => {
      res.writeHead(500)
      res.end(err)
      return
    });
  }

  cb(ret)
}
