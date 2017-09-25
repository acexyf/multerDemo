var express = require('express');
var fs =require('fs');
var multer = require('multer');
var path = require('path');
var ipaddress = getIPAdress();
var port = 8093;
var app = express();


var upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './uploads/');
        },
        filename: function (req, file, cb) {
            var changedName = (new Date().getTime())+'-'+file.originalname;
            cb(null, changedName);
        }
    })
});

app.get('/', function (req, res) {
    res.sendFile(path.resolve(__dirname, 'demo1.html'));
});

//单个文件上传
app.post('/upload/single',upload.single('singleFile'), (req,res)=>{
    console.log(req.file);
    res.json({
        code: '0000',
        type:'single',
        originalname: req.file.originalname
    })
});

//多个文件上传
app.post('/upload/multer',upload.array('multerFile'), (req,res)=>{
    console.log(req.files);
    let fileList = [];
    req.files.map((elem)=>{
        fileList.push({
            originalname: elem.originalname
        })
    });
    res.json({
        code: '0000',
        type:'multer',
        fileList:fileList
    });
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
