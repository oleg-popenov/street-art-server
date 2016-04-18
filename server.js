var express = require('express');
var operations = require("./db/operations.js");
var data = require("./db/data.js");
var app = express();
var router = express.Router();
var multer  = require('multer');
var upload = multer();
var schemas = require("./db/schemas.js");

app.set('views', "./html");
app.set('view engine', 'ejs');

router.get('/', function(req, res){
    operations.getArtworks(res);
});
router.get('/add', function(req, res) {
    res.render('add.ejs', {});
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

var uiRouter = express.Router();
uiRouter.get('/add', function(req, res) {
    res.render('add.ejs', {});
});
uiRouter.get('/', function(req, res) {
    schemas.Artwork
    .find({})
    .populate('artists')
    .exec(function(err, doc){
        if(err){
            res.status(500);
            res.send("Server fault");
        }
        res.render('list.ejs', {doc:doc});
    });
});
uiRouter.get('/:id', function(req, res) {
    schemas.Artwork
    .findOne({_id:req.params.id})
    .populate('artists')
    .exec(function(err, doc){
        if(err){
            res.status(500);
            res.send("Server fault");
        }
        res.render('edit.ejs', {doc:doc});
    });
});

app.use('/artworks', router);
app.use('/web/artworks', uiRouter);
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