var express = require('express');
var operations = require("./db/operations.js");
var data = require("./db/data1.js");
var app = express();
var router = express.Router();
var multer  = require('multer');
var upload = multer();
var schemas = require("./db/schemas.js");

// ****ARTWORKS
// List of artworks
router.get('/', function(req, res){
    operations.getArtworks(res);
});
// Add new Artwork
router.post('/', function(req, res){
    throw new Error('Not implemented yet');
});
// Delete Artwork
router.delete('/:id', function(req, res){
    throw new Error('Not implemented yet');
});

// ****IMAGES
// Get image
router.get('/image/:id', function(req, res) {
   operations.getImage(req.params.id, res); 
});
// Upload new image
router.post('/image', function(req, res){
    throw new Error('Not implemented yet');
});
// Utility route to download thumbnail
router.get('/thumb/:id', function(req, res) {
   operations.getThumb(req.params.id, res); 
});
// Delete Image
router.delete('/image/:id', function(req, res) {
    throw new Error('Not implemented yet');
});

// ****ARTISTS
// List of artists
router.get('/artists', function(req, res) {
    throw new Error('Not implemented yet');
});
// Add new artist
router.post('/artists', function(req, res) {
    throw new Error('Not implemented yet');
});
// Delete artist
router.delete('/artists/:id', function(req, res) {
    throw new Error('Not implemented yet');
});


app.use(express.static('public'));
app.use('/artworks', router);
app.all('/', function(req, res){
    res.sendFile(__dirname + '/web/artworks.html');
});

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