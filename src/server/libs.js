'use strict';

var JS = JS || {};

/**
 * Globals
 *
 * @method Globals
 */
JS.Globals = {
    http: {
        statusCode: {
            ok: 200,
            delete: 204,
            bad: 400,
            created: 201,
            forbidden: 403,
            notfound: 404
        }
    }
};

/**
 * Middleware
 *
 * @method Middleware
 */
JS.Middleware = {
    requireAuth: (req, res, next) => {
        var auth = true;

        if(auth) {
            next();
        } else {
            res.statusCode = JS.Globals.http.statusCode.forbidden;
            res.send();
        }
    }
};

/**
 * Promises
 *
 * @method Promises
 */
JS.Promises = {
    db: {
        save: (doc) => {
            return new Promise((resolve, reject) => {
                doc.save((err, docItem) => {
                    if (err) {
                        reject(new Error(err));
                    } else {
                        resolve(docItem);
                    }
                });
            });
        },
        remove: (doc, query) => {
            return new Promise((resolve, reject) => {
                doc.remove(query, (err) => {
                    if (err) {
                        reject(new Error(err));
                    } else {
                        resolve();
                    }
                });
            });
        },
        select: (doc, where) => {
            return new Promise((resolve, reject) => {
                let query = doc.find();
                for (var i = 0; i < where.length; i++) {
                    query.where(where[i]);
                }

                query.exec((err, docs) => {
                    if (err) {
                        reject(new Error(err));
                    } else {
                        resolve(docs);
                    }
                });
            });
        }
    }
};

module.exports = JS;