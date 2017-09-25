var express = require('express');
var fs =require('fs');
var multer = require('multer');
var path = require('path');
var ipaddress = getIPAdress();
var port = 8093;
var app = express();


var upload = multer({
    limits:{
        //限制文件大小10kb
        fileSize: 10*1000,
        //限制文件数量
        files: 5
    },
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            if(!!file){
                cb(null, './uploads/');
            }
        },
        filename: function (req, file, cb) {
            if(!!file){
                var changedName = (new Date().getTime())+'-'+file.originalname;
                cb(null, changedName);
            }
        }
    }),
    fileFilter: function(req, file, cb){
        if(file.mimetype == 'image/png'){
            cb(null, true)
        } else {
            cb(null, false)
        }
    }
});

app.get('/', function (req, res) {
    res.sendFile(path.resolve(__dirname, 'demo2.html'));
});


let singleUpload = upload.single('singleFile');
//单个文件上传
app.post('/upload/single',(req,res)=>{
    singleUpload(req,res,(err)=>{
        if(!!err){
            console.log(err.message)
            res.json({
                code: '2000',
                type:'single',
                originalname: '',
                msg: err.message
            })
            return;
        }
        if(!!req.file){
            res.json({
                code: '0000',
                type:'single',
                originalname: req.file.originalname,
                msg: ''
            })
        } else {
            res.json({
                code: '1000',
                type:'single',
                originalname: '',
                msg: ''
            })
        }
    });
});

let multerUpload = upload.array('multerFile');
//多个文件上传
app.post('/upload/multer', (req,res)=>{
    multerUpload(req,res,(err)=>{
        if(!!err){
            res.json({
                code: '2000',
                type:'multer',
                fileList:[],
                msg: err.message
            });
        }
        let fileList = [];
        req.files.map((elem)=>{
            fileList.push({
                originalname: elem.originalname
            })
        });
        res.json({
            code: '0000',
            type:'multer',
            fileList:fileList,
            msg:''
        });
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
