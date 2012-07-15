
/**
 * Module dependencies.
 */

var express = require('express'),
  http = require('http'),
  fs = require('fs'),
  flash = require('connect-flash');

utils = require(__dirname + '/lib/utils');
auth = require(__dirname + '/lib/authentication');

// Load configurations
var config_file = require('yaml-config')
exports = module.exports = config = config_file.readConfig('./config.yaml')

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/app/views');
  app.set('view engine', 'jade');
  app.set('view options', { layout: __dirname + '/app/views/layouts/application' });
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser()); 
  app.use(express.session({ secret: 'my app secret' }));
  app.use(express.static(__dirname + '/public'));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());
  app.use(app.router);
});

// Load environment-specific config
app.configure('development', function(){
  app.use(express.errorHandler());
});

// Connect to db and load models
require(__dirname + '/lib/db-connect');

// Load models
var model_path = __dirname + '/app/models',
    model_files = fs.readdirSync(model_path);

model_files.forEach(function(file) {
  require(model_path + '/' + file);
});

require(__dirname + '/app/models/models.js')(app);

// Load routes
var controller_path = __dirname + '/app/controllers',
    controller_files = fs.readdirSync(controller_path);

controller_files.forEach(function(file) {
  require(controller_path + '/' + file)(app);
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
