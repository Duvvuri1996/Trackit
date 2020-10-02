const config = require('/home/sowmya/trackIt/trackItBackEnd/config/config');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const response = require('../libs/response');
const logger = require('../libs/logger');
const crypto = require('crypto');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');


let connection = mongoose.createConnection((config.db.uri),{ useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true })
let gfs
connection.once('open', function() {
    gfs = Grid(connection.db, mongoose.mongo)
    gfs.collection('uploads')
})

const storage = new GridFsStorage({
    url : config.db.uri,
    file : (req, file) =>{
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buff) => {
                if(err) {
                    logger.error(err.message, "Unknown error at storage file() function", 10)
                    let apiResponse = response.generate(true, "Unknown error at storage file() function", 500, null)
                    reject(apiResponse)
                } else {
                    const fileName = buff.toString('hex')+path.extname(file.originalname)
                    const fileInfo = {
                        fileName : fileName,
                        bucketName : 'uploads'
                    }
                    resolve(fileInfo)
                }
            })
        })
    }
})

let upload = multer({ storage })

let uploadFile = (req, res) => {
    logger.info("File uploaded successfully", "at uploadeFile() function", 10)
    res.json({ file:req.file, FileName : req.file.fileName })
}

let getAllFiles = async(req, res) => {
    let files=await gfs.files.find({}).toArray()
    try{ 
        let apiResponse = response.generate(false, 'All Files Found', 200, files)
         res.send(apiResponse)
       } catch(err){
        logger.error(err.message, 'Multer: getAllFile', 10)
        let apiResponse = response.generate(true, 'Failed To Find File Data', 500, null)
        res.send(apiResponse)
       }
  }

let getSingleFile = async(req, res) => {
    file = await gfs.files.findOne({ filename: req.params.filename })
        try{
            let apiResponse = response.generate(false, 'All Files Found', 200, file)
            res.send(apiResponse)
        } catch(err){
            logger.error(err.message, 'Multer: getSingleFile', 10)
            let apiResponse = response.generate(true, 'Failed To Find File Data', 500, null)
            res.send(apiResponse)
        }
  }

let downloadFile = async(req, res) => {
    let file = await gfs.files.findOne({ filename: req.params.filename })
        try{
            
            const readStream = gfs.createReadStream({filename: file.filename});
            console.log(file.filename+" file name is this!")
            
           res.set('Content-Type', file.contentType)
            readStream.pipe(res)
            
        } catch(err){
            logger.error(err.message, 'Multer: downloadFile', 10)
            let apiResponse = response.generate(true, 'Failed To Find File Data', 500, null)
            res.send(apiResponse)
        }
  }

let deleteFile = async(req, res) => {
    const result =  await gfs.files.deleteOne({ _id: req.params.id, root: 'uploads' })
        try{
            let apiResponse = response.generate(false, 'File Deleted succesfully', 200, result)
            res.send(apiResponse)
        } catch(err){
            logger.error(err.message, 'Multer: deleteFile', 10)
            let apiResponse = response.generate(true, 'Failed To Delete File Data', 500, null)
            res.send(apiResponse)
        }
  }

module.exports = {
    upload : upload,
    uploadFile : uploadFile,
    getAllFiles : getAllFiles,
    getSingleFile :getSingleFile,
    downloadFile : downloadFile,
    deleteFile : deleteFile               
}