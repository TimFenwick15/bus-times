require('./requestbus').bus()
  .then(_ => console.log(_))
  .catch(_ => console.log(_))
