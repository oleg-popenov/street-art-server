var express = require('express');
var operations = require("./db/operations.js");
var data = require("./db/data1.js");
var app = express();
var router = express.Router();
var webRouter = express.Router();
var multer  = require('multer');
var upload = multer();
var schemas = require("./db/schemas.js");

router.get('/', function(req, res){
    operations.getArtworks(res);
});
router.post('/add', upload.any(), function(req, res) {
    operations.addArtwork(req, res);
});
router.get('/image/:id', function(req, res) {
   operations.getImage(req.params.id, res); 
});
router.get('/initData', function(req, res) {
    operations.importData(data.json, function(){
        res.status(200);    
        res.write('<h1>Done</h1>');
        res.send();
   });
});

webRouter.get('/', function(req, res) {
    res.sendFile(__dirname + '/web/artworks.html');
});
webRouter.get('/:id', function(req, res) {
    res.sendFile(__dirname + '/web/details.html');
});

app.use('/artworks', router);
app.use('/web', webRouter);
app.use(express.static('public'));

app.use(function(req, res, next){
    res.status(404);
    res.send({ error: 'Not found' });
    return;
});

app.use(function(err, req, res, next){
    res.status(err.status || 500);
    res.send({ error: err.message });
    return;
});

app.listen(process.env.PORT || 80, process.env.IP, function() {
    console.log('MONGOLAB_URI='+ process.env.MONGOLAB_URI);
    console.log('APP_URL=' + process.env.APP_URL);
    console.log('server is running');
});