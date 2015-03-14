/**
 * Created by Bartosz on 2015-03-14.
 */
var mongoose = require('mongoose');
var multer  = require('multer');
var File = require('../models/File');
var fs = require("fs");

var allowedMimeTypes = new Array("image/png", "image/jpg", "image/gif");

module.exports = function(app){

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
            // Error msg goes here
            return false;
        }

        fs.exists(req.files.userfile.path, function(exists) {
            if(exists){
                var fileName = req.files.userfile.name;
                var mimeType = req.files.userfile.mimetype;
                // check is allowed
                if(allowedMimeTypes.indexOf(mimeType) !== -1){
                    var file = new File({
                        src: fileName,
                        content : req.body.content || '',
                        parentId : req.body.parentId || '',
                        parentType : req.body.parentType || '',
                        owner : req.body.owner || ''
                    });
                    file.save(function(err, savedFile) {
                        if (err) return next(err);
                        //return file id
                        res.json({"file_id" : savedFile._id});
                    });
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
            if (err) return next(err);
            req.flash('success', { msg: 'File has been deleted.' });
            res.redirect('/');
        });
    });
}