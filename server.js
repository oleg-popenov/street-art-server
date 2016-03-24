var express = require('express');
var operations = require("./db/operations.js")
var app = express();
var router = express.Router();

app.set('views', "./html");
app.set('view engine', 'ejs');
router.get('/', function(req, res){
    operations.getArtworks(res);
});
router.get('/add', function(req, res) {
    operations.addArtwork(req, res)
})

app.use('/artworks', router);

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