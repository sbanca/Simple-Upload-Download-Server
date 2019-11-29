var express = require('express');
var multer  = require('multer');
var fs  = require('fs');
const serveIndex = require('serve-index')
var os = require('os');
var ifaces = os.networkInterfaces();
var ip;

var app = express();

app.set('view engine', 'ejs');

app.use('/download', express.static('uploads'), serveIndex('uploads', {'icons': true}));

app.get('/', (req, res) => {
    res.render('index');
});

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        var dir = './uploads';
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        callback(null, dir);
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});

var upload = multer({storage: storage}).array('files', 12);
app.post('/upload', function (req, res, next) {
    upload(req, res, function (err) {
        if (err) {
            return res.end("Something went wrong:(");
        }
        res.end("Upload completed.");
        console.log("Upload completed.");
    });
})



Object.keys(ifaces).forEach(function (ifname) {
  var alias = 0;

  ifaces[ifname].forEach(function (iface) {
    if ('IPv4' !== iface.family || iface.internal !== false) {
      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      return;
    }

    if (alias >= 1) {
      // this single interface has multiple ipv4 addresses
      //console.log(ifname + ':' + alias, iface.address);
    } else {
      if (ifname=="Wi-Fi" || ifname=="Ethernet" ) {
          //console.log(ifname, iface.address);
          ip = iface.address;
      }
    }
    ++alias;
  });
});

app.listen(3000, ()=> 
console.log("Server up listening on "+ip+ ":3000"));
