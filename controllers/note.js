var mongoose = require('mongoose');
var Note = require('../models/Note')
var ApiStatus = require('../models/ApiStatus');


module.exports = function(app){

    /**
     * Fetch all notes by parentId
     *
     * @return json
     */
    app.get('/note/fetchall/:parent_id',function(req, res){
        var parentId = req.params.parent_id;
        var filter = {"parentId" : parentId};
        var query = Note.find(filter, 'createdAt updatedAt content type parentId parentType parentId files owner', { }).sort({date: 'desc'});
        query.exec(function (err, docs) {
            res.json(docs);

        });
    });

    /**
     * Fetch single note
     *
     * @return json
     */
    app.get('/note/fetch/:note_id',function(req, res){
        var noteId = req.params.note_id;
        Note.findOne({_id: new mongoose.Schema.ObjectId(noteId)}, function (err, existingNote) {
            if(existingNote){
                res.json(existingNote);
            }
        });
    });

    /**
     * Insert note
     */
    app.post('/note/insert',function(req, res) {

        //todo

        //req.assert('content', 'Content cannot be blank').notEmpty();
        //req.assert('type', 'Type cannot be blank').notEmpty();
        //req.assert('parentId', 'ParentId cannot be blank').notEmpty();
        //req.assert('parentType', 'ParentType cannot be blank').notEmpty();
        //req.assert('owner', 'Owner cannot be blank').notEmpty();

        //var errors = req.validationErrors();
        //if (errors) {
        //    req.flash('errors', errors);
        //    return res.redirect('/');
        //}

        var note = new Note({
            createdAt: new Date(req.body.updatedAt),
            updatedAt: new Date(req.body.updatedAt),
            content : req.body.content || '',
            type : req.body.type || 'Note',
            parentId : req.body.parentId || '',
            parentType : req.body.parentType || '',
            files: req.body.files,
            owner : req.user.profile.name || req.user.email
        });

        note.save(function(err) {
            if (err) {
                return res.json({ status: err, code: ApiStatus.CODE_ERROR });
            }
            res.json({ status: ApiStatus.STATUS_SUCCESS, code: ApiStatus.CODE_SUCCESS });
        });
    });

    /**
     * Delete note
     */
    app.get('/note/delete/:note_id', function(req, res) {
        var noteId = req.params.note_id;
        Note.remove({ _id: noteId }, function(err) {
            if (err) {
                return res.json({ status: err, code: ApiStatus.CODE_ERROR });
            }
            return res.json({ status: ApiStatus.STATUS_SUCCESS, code: ApiStatus.CODE_SUCCESS });
        });
    });

    /**
     * Edit note
     */
    app.post('/note/update/:note_id',function(req, res) {
        var noteId = req.params.noteId;
        Note.findById(noteId, function(err, ExistingNote) {
            if (err) return next(err);
            ExistingNote.updatedAt = new Date();
            ExistingNote.content = req.body.content || '';
            ExistingNote.type = req.body.type || '';
            ExistingNote.parentId = req.body.parentId || '';
            ExistingNote.parentType = req.body.parentType || '';
            ExistingNote.owner = req.user.profile.name || req.user.email;

            res.json({ status: ApiStatus.STATUS_SUCCESS, code: ApiStatus.CODE_SUCCESS });


            ExistingNote.save(function(err) {
                if (err) {
                    res.json({ status: err, code: ApiStatus.CODE_ERROR });


                    return next(err);
                }
            });
        });
    });
}