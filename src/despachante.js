const fs = require('fs');

/*
------------------------------------------------------------------
*/

let ret = false

exports.despachar = (req, res, cb) => {

  ret = false

  if (req.url === '/') {
    ret = true

    fs.readFile(__dirname + "/cli/index.html", 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500)
        res.end(err)
        return
      }
      res.setHeader("Content-Type", "text/html")
      res.writeHead(200)
      res.end(data)
    })
  }
  if (req.url === '/cli/javascript.js') {
    ret = true

    fs.readFile(__dirname + "/cli/javascript.js", 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500)
        res.end(err)
        return
      }
      res.setHeader("Content-Type", "text/javascript")
      res.writeHead(200)
      res.end(data)
    })
  }
  if (req.url === '/cli/styles.css') {
    ret = true

    fs.readFile(__dirname + "/cli/styles.css", 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500)
        res.end(err)
        return
      }
      res.setHeader("Content-Type", "text/css")
      res.writeHead(200)
      res.end(data)
    })
  }
  if (req.url === '/cli/xlsx.full.min.js') {
    ret = true

    fs.readFile(__dirname + "/cli/xlsx.full.min.js", 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500)
        res.end(err)
        return
      }
      res.setHeader("Content-Type", "application/javascript")
      res.writeHead(200)
      res.end(data)
    })
  }
  if (req.url === '/favicon.ico') {
    ret = true

    fs.readFile(__dirname + "/img/chubut.jpg", 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500)
        res.end(err)
        return
      }
      res.setHeader("Content-Type", "image/jpeg")
      res.writeHead(200)
      res.end(data)
    })
  }
  cb(ret)
}
