
var express = require('express');
var fs =require('fs');
var multer = require('multer');
var path = require('path');

var ipaddress = getIPAdress();
var port = 8093;


var app = express();


var upload = multer({
    limits: {
        //在multipart表单中, 文件最大数量
        files: 10,
        //在multipart表单中, 文件最大长度 (字节单位)
        fileSize: 1000*1000*5
    },
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads/')
        },
        filename: function (req, file, cb) {
            // console.log(file,'filename')
    
            var changedName = (new Date().getTime())+'-'+file.originalname;
            cb(null, changedName);
    
        }
    }),
    fileFilter: function(req, file, cb){

        // if(file.mimetype == 'image/png'){
        //     cb(null, true)
        // } else {
        //     cb(null, false)
        // }

        cb(null, true);

    }
});

app.get('/', function (req, res) {
    res.sendFile(path.resolve(__dirname, 'uploadServer1.html'));
});

app.post('/upload/single',upload.single('singleFile'), function(req,res){
    console.log(req.file);
    res.json({
        code: '0000',
        type:'single'
    })
});




let server = app.listen(port, function () {
    
    if (ipaddress) {
        console.log('please open ' + ipaddress + ':' + port + ' in browser');
    } else {
        console.log('no networking, please open ' + ipaddress + ':' + port + ' in browser')
    }

});

/**
 * 获取本机IP
 * @return {[string]} [IP地址]
 */
function getIPAdress() {
    var interfaces = require('os').networkInterfaces();
    for (var devName in interfaces) {
        var iface = interfaces[devName];
        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
}
