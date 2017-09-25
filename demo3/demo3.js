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
    res.sendFile(path.resolve(__dirname, 'demo3.html'));
});

//多字段名上传
let multipleFields = upload.fields([
    {name:'avatar', maxCount:3},
    {name:'gallery', maxCount:3}
]);
app.post('/upload/fields', (req,res)=>{
    multipleFields(req,res,(err) => {
        console.log(req.files);
        if(!!err){
            console.log(err.message);
            res.json({
                code: '2000',
                type: 'field',
                msg:err.message
            })
            return;
        }
        var fileList = [];
        for(let item in req.files){
            var fieldItem = req.files[item];
            fieldItem.map((elem) => {
                fileList.push({
                    fieldname: elem.fieldname,
                    originalname: elem.originalname
                })
            });
        }

        res.json({
            code: '0000',
            type: 'field',
            fileList: fileList,
            msg:''
        })
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
