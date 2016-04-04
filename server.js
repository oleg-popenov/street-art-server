var express = require('express');
var operations = require("./db/operations.js");
var data = require("./db/data.js");
var app = express();
var router = express.Router();
var multer  = require('multer');
var upload = multer();

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

app.use('/artworks', router);
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
    console.log('server is running');
});