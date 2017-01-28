require('http').createServer((req, res) => {
  res.writeHead(200, {"Content-Type": "text/plain"})
  require('./requestbus').bus()
    .then(_ => {
      console.log('Success: ' + _)
      res.end( _)
    })
    .catch(_ => {
      console.log('Err: ' + _)
      res.end(_)
    })
}).listen(8000);

console.log("Server running at http://127.0.0.1:8000/");


