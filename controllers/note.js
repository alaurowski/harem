var mongoose = require('mongoose');

module.exports = function(app){

    /**
     * Fetch all notes by parentId
     */
    app.get('/note/fetchall',function(req, res){
        var parentId = req.params.parentId;
        var filter = {'parentId': parentId};
        var query = Lead.find(filter, 'createdAt updatedAt content type parentId parentType parentId', { }).sort({date: 'desc'});
        query.exec(function (err, docs) {
            res.json(docs);
        });
    });

    /**
     * Fetch single note
     *
     * @deprecated
     */
    app.get('/note/fetch',function(req, res){
        var parentId = req.params.parentId;
        if(parentId != ''){
            Lead.findOne({_id: new mongoose.Schema.ObjectId(parentId)}, function (err, existingNote) {
                if(existingNote){
                    res.json(existingNote);
                }
            });
        }
    });

    /**
     * Edit note
     *
     * @todo This function needs fresh look
     */
    app.post('/note/edit',function(req, res) {

        Lead.findById(req.body._id, function (err, existingNote) {
            if (!existingNote) {
                existingNote = new Note();
                existingNote.createdAt = new Date();
                existingNote.updatedAt = new Date();
            }

            existingNote.content = req.body.content;
            existingNote.type = req.body.type;
            existingNote.parentType = req.body.parentType;
            existingNote.parentId = req.body.parentId;
            existingNote.save(function (err) {
                if (err && err.errors) {
                    res.json(err.errors);
                }
            });
        });
    });
}