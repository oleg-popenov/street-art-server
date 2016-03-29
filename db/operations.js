var schemas = require("./schemas.js");

var Artwork = schemas.Artwork;
var Photo = schemas.Photo;
var Artist = schemas.Artist;
var Image = schemas.Image;
var ObjectId = schemas.ObjectId;

var getArtworks = function(res) {
    Artwork
        .find({})
//        .populate('artists._id')
        .exec(function(error, result) {
            if (error) {
                throw new Error(error);
            }
            res.status(200);
            res.json(result);
        });
};

var addArtwork = function(req, res) {
    if (!req.body) throw new Error("Empty form");
    var form = req.body;
    var files = req.files;

    var artwork = new Artwork({
        url: form.url,
        name: form.name,
        description: form.description,
        location: {
            lat: form.location_lat,
            lng: form.location_lng,
            address: form.location_address
        },
        status: {
            code: form.status_code,
            name: form.status_name
        },
        icon: form.icon
    });

    var imagesIds = files.map(function(it){return new ObjectId()}); //generate Ids for each image
    var imagesToSave = files.map(function(file, index, array) {
        return new Image({
            _id: imagesIds[index],
            image: file.buffer
        });
    });

    Image.create(imagesToSave, function(err, doc) {
        if (err) throw new Error('Cannot put images to DB');
        var artists = [];
        var photos = [];
        files.forEach(function(file, index, array) {
            var pair = file.fieldname.split("_");
            if (pair[0] === 'artist') {
                var artist = new Artist({
                    name: form['artist_name' + pair[1]],
                    photo: imagesIds[index]
                });
                artists.push(artist);
            } else if (pair[0] === 'photo') {
                var photo = new Photo({
                    title: form['photo_title' + pair[1]],
                    image: imagesIds[index]
                });
                photos.push(photo);
            }
        });
        
        Artist.create(artists, function(err, doc){
            if(err) throw new Error('Cannot insert artists');
            Photo.create(photos, function(err, doc){
                if(err) throw new Error('Cannot insert photos');
                artwork.artists = artists;
                artwork.photos = photos;
                artwork.save(function(err) {
                   if(err) throw new Error('Cannot save artwork');
                   res.status(200);
                   res.json(artwork);
                });
            });
        });
        
    });
};

function getImage(objectId, res) {
    Image.findOne({
        _id: objectId
    }, function(err, image) {
        if (err) {
            res.status(404);
            res.send();
            return;
        }
        res.writeHead(200, {
            'Content-Type': 'image/jpeg'
        });
        res.end(image.image);
    });
};

module.exports.getImage = getImage;
module.exports.getArtworks = getArtworks;
module.exports.addArtwork = addArtwork;