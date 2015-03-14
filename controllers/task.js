var mongoose = require('mongoose');
var Task = require('../models/Task')
module.exports = function(app){

    /**
     * Fetch all tasks by parentId
     *
     * @return json
     */
    app.get('/task/fetchall/:parent_id',function(req, res){
        var parentId = req.params.parent_id;
        var filter = {"parentId" : parentId};
        var query = Task.find(filter).sort({due: 'desc'});
        query.exec(function (err, docs) {
            res.json(docs);
        });
    });

    /**
     * Fetch single task
     *
     * @return json
     */
    app.get('/task/fetch/:task_id',function(req, res){
        var taskId = req.params.task_id;
        Task.findOne({_id: new mongoose.Schema.ObjectId(taskId)}, function (err, existingTask) {
            if(existingTask){
                res.json(existingTask);
            }
        });
    });

    /**
     * Insert task
     */
    app.post('/task/insert',function(req, res) {
        req.assert('content', 'Content cannot be blank').notEmpty();
        req.assert('due', 'Due date cannot be blank').notEmpty();
        req.assert('parentId', 'ParentId cannot be blank').notEmpty();
        req.assert('parentType', 'ParentType cannot be blank').notEmpty();
        req.assert('status', 'Status cannot be blank').notEmpty();
        req.assert('owner', 'Owner cannot be blank').notEmpty();

        var errors = req.validationErrors();
        if (errors) {
            req.flash('errors', errors);
            return res.redirect('/');
        }

        var task = new Task({
            createdAt: new Date(),
            updatedAt: new Date(),
            content : req.body.content || '',
            due : req.body.due || '',
            parentId : req.body.parentId || '',
            parentType : req.body.parentType || '',
            status : req.body.status || '',
            owner : req.body.owner || ''
        });

        task.save(function(err) {
            if (err) return next(err);
            req.flash('success', { msg: 'Task updated.' });
            res.redirect('/');
        });
    });

    /**
     * Delete task
     */
    app.post('/task/delete/:task_id', function(req, res) {
        var taskId = req.params.task_id;
        Task.remove({ _id: new mongoose.Schema.ObjectId(taskId) }, function(err) {
            if (err) return next(err);
            req.flash('success', { msg: 'Task has been deleted.' });
            res.redirect('/');
        });
    });

    /**
     * Edit task
     */
    app.post('/task/update/:task_id',function(req, res) {
        var taskId = req.params.task_id;
        Task.findById(taskId, function(err, ExistingTask) {
            if (err) return next(err);
            ExistingTask.updatedAt = new Date();
            ExistingTask.content = req.body.content || '';
            ExistingTask.parentId = req.body.parentId || '';
            ExistingTask.parentType = req.body.parentType || '';
            ExistingTask.status = req.body.status || '';
            ExistingTask.owner = req.body.owner || '';
            ExistingTask.save(function(err) {
                if (err) return next(err);
                req.flash('success', { msg: 'Task saved.' });
                res.redirect('/');
            });
        });
    });
}