
/**
 * Module dependencies.
 */

// load test https://www.npmjs.org/package/bench-rest

var express         = require('express');
var http            = require('http');
var path            = require('path');

var apiToken        = require('../api-token/index');
/* set expiration time to 2 minutes */
apiToken.setExpirationTime(2);

var app             = express();

app.set('port', process.env.PORT || 3000);
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

/*
 all API calls goes through this
 */
app.all('/api/*', function(req, res, next){
    if(req.url === '/api/authenticate'){
        /* token is not needed when posting authentication credentials */
        next();
    }else if(apiToken.isTokenValid(req.get('API-Token'))){
        /* continue if token is valid */
        next();
    }else{
        /* send 401 if not authenticating or token is invalid */
        res.send(401);
    }
});
/*
 Authenticate with username and password
 */
app.post('/api/authenticate', function(req, res){
    /* obviously your authentication has to be better... */
    var  authenticated = (req.body.username=='foo'&&req.body.password=='bar');
    if(!authenticated){
        /* send 401 if authentication fails */
        res.send(401);
    }else{
        var user = apiToken.addUser(req.body.username);
        /* send token to user */
        res.send(200,{'token':user.token});
    }
});

app.get('/api/test/:id', function(req, res){
    res.send(200,{'message':'Hello no. '+req.params.id});
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});