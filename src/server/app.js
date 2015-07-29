'use strict';

var regexRoute = /(\w+)(\.route\.js)$/i,
    bodyParser = require('body-parser'),
    config = require('./config'),
    JS = require('./libs'),
    express = require('express'),
    path = require('path'),
    fs = require('fs'),
    app = express(),
    routes;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.resolve('./../public')));


routes = fs.readdirSync('./routes');
for(let route of routes) {
    let match = regexRoute.exec(route);

    if(match !== null) {
        app.all('/' + match[1] + '/*', JS.Middleware.requireAuth);
        app.use('/' + match[1], require('./routes/' + match[1] + '.route'));
    }
}

app.route('/*').get((req, res) => {
    res.sendFile(path.resolve('./../public/index.html'));
});

app.listen(config.port, () => {
    console.log('Server is running', config.port);
});
