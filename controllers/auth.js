/* auth api for angular */

var bodyParser = require('body-parser');

module.exports = function (app) {
    app.get('/auth/check', function(req, res){
        if (req.isAuthenticated()) {
            res.sendStatus(200);
        } else {
            res.sendStatus(401);
        }
    });

    app.get('/auth/info', function(req, res) {
        if (req.isAuthenticated()) {
            res.json(req.user);
        } else {
            res.sendStatus(401);
        }
    });
}