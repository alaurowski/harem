var mongoose = require('mongoose');
var Task = require('../models/Task');
var ApiStatus = require('../models/ApiStatus');

module.exports = function(app){


    /**
     * Fetch all all tasks
     *
     * @return json
     */
    app.get('/task/index',function(req, res){
        var query = Task.find({ completed: {'$ne': true}  }).sort({due: 'desc'});
        query.exec(function (err, docs) {
            res.json(docs);
        });
    });

    /**
     * Fetch all tasks by parentId
     *
     * @return json
     */
    app.get('/task/fetchall/:parent_id',function(req, res){
        var parentId = req.params.parent_id;
        var filter = {"parentId" : parentId, completed: {'$ne': true} };
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
        //req.assert('content', 'Content cannot be blank').notEmpty();
        //req.assert('due', 'Due date cannot be blank').notEmpty();
        //req.assert('parentId', 'ParentId cannot be blank').notEmpty();
        //req.assert('parentType', 'ParentType cannot be blank').notEmpty();
        //req.assert('status', 'Status cannot be blank').notEmpty();
        //req.assert('owner', 'Owner cannot be blank').notEmpty();
        //
        //var errors = req.validationErrors();
        //if (errors) {
        //    req.flash('errors', errors);
        //    return res.redirect('/');
        //}

        var task = new Task({
            createdAt: new Date(),
            updatedAt: new Date(),
            content : req.body.content || '',
            due : req.body.due || '',
            parentId : req.body.parentId || '',
            parentType : req.body.parentType || '',
            status : req.body.status || '',
            completed:  req.body.completed || '',
            extra: req.body.extra || '',
            owner : req.body.owner || ''
        });

        task.save(function(err) {
            if (err) {
                return res.json({ status: err, code: ApiStatus.CODE_ERROR });
            }
            return res.json({ status: ApiStatus.STATUS_SUCCESS, code: ApiStatus.CODE_SUCCESS });
        });
    });

    /**
     * Delete task
     */

    app.get('/task/delete/:task_id', function(req, res) {
        var taskId = req.params.task_id;
        Task.remove({ _id: taskId }, function(err) {
            if (err) {
                return res.json({ status: err, code: ApiStatus.CODE_ERROR });
            }
            return res.json({ status: ApiStatus.STATUS_SUCCESS, code: ApiStatus.CODE_SUCCESS });
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
            ExistingTask.completed = req.body.completed || '';
            ExistingTask.owner = req.body.owner || '';
            ExistingTask.extra = req.body.extra || '';
            ExistingTask.save(function(err) {
                if (err) {
                    res.json({ status: err, code: ApiStatus.CODE_ERROR });

                    return next(err);
                }

                res.json({ status: ApiStatus.STATUS_SUCCESS, code: ApiStatus.CODE_SUCCESS });

            });
        });
    });

    /**
     * Edit task
     */
    app.post('/task/toggle/:task_id',function(req, res) {
        var taskId = req.params.task_id;
        Task.findById(taskId, function(err, ExistingTask) {
            if (err) return next(err);

            ExistingTask.completed = ExistingTask.completed ? false : true;

            ExistingTask.save(function(err) {
                if (err) {
                    res.json({ status: err, code: ApiStatus.CODE_ERROR });

                    return next(err);
                }

                res.json({ status: ApiStatus.STATUS_SUCCESS, code: ApiStatus.CODE_SUCCESS });

            });
        });
    });

}