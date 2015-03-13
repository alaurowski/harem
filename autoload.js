/**
 * Created by pkarwatka on 13.03.15.
 */
/**
 * Auto load modules from specified directory
 * @param app express app instance
 * @param moduleDir eg. "controllers"
 */
    module.exports = function(app, moduleDir) {
        var fs = require("fs");
        var routePath = "./"+moduleDir+"/"; //add one folder then put your route files there my router folder name is routers
        fs.readdirSync(routePath).forEach(function (file) {
            var route = routePath + file;
            var moduleObj = require(route);

            if(moduleObj.call) // load only compatible modules
            {
                moduleObj(app);
            }

        });
    }