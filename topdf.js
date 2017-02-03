var fs = require('fs');
var pdf = require('html-pdf');
var path = require('path')
var RootDir = process.cwd();
// var base = path.join(__dirname, '/dist/index.css');
var base = path.join(__dirname,'../diygod/Resume/src/css/print.scss');
base = 'file:\\\\'+base;
// var html = fs.readFileSync('./dist/index.html', 'utf8');
var html = fs.readFileSync('../diygod/Resume/print.html', 'utf8');
var pdfConfig = {
  // "height": "2400px",        // allowed units: mm, cm, in, px
  // "width": "1018px",            // allowed units: mm, cm, in, px
  "format": "A4",        // allowed units: A3, A4, A5, Legal, Letter, Tabloid
  "orientation": "portrait", // portrait or landscape
  // Page options
  "border": "0",             // default is 0, units: mm, cm, in, px

  // Rendering options
  "base": base, // Base path that's used to load files (images, css, js) when they aren't referenced using a host
  // Zooming option, can be used to scale images if `options.type` is not pdf
  "zoomFactor": "1", // default is 1
  // File options
  "type": "pdf",             // allowed file types: png, jpeg, pdf
  "quality": "100",           // only used for types png & jpeg
}


pdf.create(html, pdfConfig).toFile('./dist/pdf/index.pdf', function(err, res) {
  if (err) return console.log(err);
  console.log(res); // { filename: '/app/businesscard.pdf' }
});