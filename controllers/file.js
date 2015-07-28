/**
 * Created by Bartosz on 2015-03-14.
 */
var mongoose = require('mongoose');
var multer  = require('multer');
var File = require('../models/File');
var fs = require("fs");
var ApiStatus = require('../models/ApiStatus');

var allowedMimeTypes = new Array(
    "image/png",
    "image/jpg",
    "text/plain",
    "image/jpeg",
    "image/gif",
    "application/msword",
    "application/pdf"
);

module.exports = function(app){


    /**
     * Download single file
     *
     * @return json
     */
    app.get('/file/download/:file_id',function(req, res){
        var fileId = req.params.file_id;
        File.findOne({_id:  fileId}, function (err, existingFile) {
            if(existingFile){
                res.download('./uploads/' + existingFile.src, existingFile.originalName);

                return;
            }

            res.status(404);

        });
    });


    /**
     * Fetch single file
     *
     * @return json
     */
    app.get('/file/fetch/:file_id',function(req, res){
        var fileId = req.params.file_id;
        File.findOne({_id: new mongoose.Schema.ObjectId(fileId)}, function (err, existingFile) {
            if(existingFile){
                res.json(existingFile);
            }
        });
    });

    /**
     * Upload file
     */
    app.post('/file/insert',function(req, res) {
        if (req.files.userfile.size === 0) {
            return res.json({ status: err, code: ApiStatus.CODE_ERROR });
        }

        fs.exists(req.files.userfile.path, function(exists) {
            if(exists){
                var fileName = req.files.userfile.name;
                var originalName = req.files.userfile.originalname;
                var mimeType = req.files.userfile.mimetype;
                // check is allowed
                if(allowedMimeTypes.indexOf(mimeType) !== -1){
                    var file = new File({
                        src: fileName,
                        originalName: originalName,
                        content : req.body.content || '',
                        owner : req.body.owner || '',
                        parentType : req.body.parentType || ''

                    });

                    if(req.body.parentId)
                        file.parentId = req.body.parentId;


                    file.save(function(err, savedFile) {
                        if (err) return res.json({ status: err, code: ApiStatus.CODE_ERROR });

                        //return file id
                        file.status = ApiStatus.STATUS_SUCCESS;
                        file.code = ApiStatus.CODE_SUCCESS;
                        res.json(file);


                    });
                }else{
                    return res.json({ status: ApiStatus.STATUS_ERROR, code: ApiStatus.CODE_ERROR });
                }
            }
        });
    });

    /**
     * Delete file
     */
    app.post('/file/delete/:file_id', function(req, res) {
        var fileId = req.params.file_id;
        File.remove({ _id: fileId }, function(err) {
            if (err) {
                return res.json({ status: err, code: ApiStatus.CODE_ERROR });
            }else{
                return res.json({ status: ApiStatus.STATUS_SUCCESS, code: ApiStatus.CODE_SUCCESS });
            }
        });
    });
}