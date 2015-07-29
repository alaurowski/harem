'use strict';

var express = require('express'),
    Lead = require('./../models/Lead'),
    JS = require('./../libs'),
    db = JS.Promises.db,
    route = express.Router();

route.post('/', (req, res) => {
    let lead = new Lead();

    lead.createdAt = new Date();
    lead.owner = req.body.owner;
    lead.state = req.body.state;

    lead.subtitle = req.body.subtitle;

    lead.description = req.body.description;
    lead.tags = req.body.tags;

    lead.source = req.body.source;
    lead.contact = req.body.contact;

    if (req.body.cv !== undefined) {
        lead.cv = req.body.cv;
    }

    db.save(lead)
        .then((doc) => {
            res.statusCode = JS.Globals.http.statusCode.created;
            res.json({
                'leadId': doc._id
            });
        })
        .catch(() => {
            res.statusCode = JS.Globals.http.statusCode.bad;
            res.send();
        });
});

route.put('/:id', (req, res) => {
    let leadId = req.params.id,
        params = req.body,
        where = [];

    where.push({'_id': leadId});

    db.select(Lead, where)
        .then((doc) => {
            if(!doc) {
                res.statusCode = JS.Globals.http.statusCode.notfound;
                res.send();
            } else {
                for(let key in params) {
                    doc[key] = params[key];
                }
                return doc;
            }
        })
        .then((doc) => {
            return db.save(doc);
        })
        .then((doc) => {
            res.statusCode = JS.Globals.http.statusCode.created;
            res.json({
                'leadId': doc._id
            });
        })
        .catch(() => {
            res.statusCode = JS.Globals.http.statusCode.notfound;
            res.send();
        });
});

route.get('/', (req, res) => {
    db.select(Lead)
        .then((docs) => {
            res.statusCode = JS.Globals.http.statusCode.ok;
            res.json(docs);
        })
        .catch(() => {
            res.statusCode = JS.Globals.http.statusCode.bad;
            res.send();
        });
});

route.get('/:id', (req, res) => {
    let leadId = req.params.id,
        where = [];

    where.push({'_id': leadId});

    db.select(Lead, where)
        .then((docs) => {
            res.statusCode = (docs) ? JS.Globals.http.statusCode.ok : JS.Globals.http.statusCode.notfound;
            res.json(docs);
        })
        .catch(() => {
            res.statusCode = JS.Globals.http.statusCode.notfound;
            res.send();
        });
});

route.delete('/:id', (req, res) => {
    let leadId = req.params.id;

    db.remove(Lead, { _id: leadId })
        .then(() => {
            res.statusCode = JS.Globals.http.statusCode.delete;
            res.send();
        })
        .catch(() => {
            res.statusCode = JS.Globals.http.statusCode.notfound;
            res.send();
        });
});

module.exports = route;
