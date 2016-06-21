var schemas = require("./schemas.js");
var request = require('request');
var lwip    = require('lwip');
var fs      = require('fs');

var Artwork = schemas.Artwork;
var Photo = schemas.Photo;
var Artist = schemas.Artist;
var Image = schemas.Image;
var ObjectId = schemas.ObjectId;

var getArtworks = function(res) {
    Artwork
        .find({})
        .populate('artists')
        .exec(function(error, result) {
            if (error) {
                throw new Error(error);
            }
            res.status(200);
            res.json(result);
        });
};

// Add new Artwork

var addArtwork = function(req, res){
    //TODO
};
// Delete Artwork
var deleteArtwork = function(id, res){
    Artwork.remove({_id: id}, function(err){
        res.status(!err ? 200 : 500);
        res.send();
        return;
    });
};


function getImage(objectId, res) {
    Image.findOne({
        _id: objectId
    }, function(err, image) {
        if (err || !image) {
            res.status(404);
            res.send();
            return;
        }
        res.writeHead(200, {
            'Content-Type': 'image/jpeg'
        });
        res.end(new Buffer(image.image.toString(), 'base64'));
    });
};
function getThumb(objectId, res) {
    Image.findOne({
        _id: objectId
    }, function(err, image) {
        if (err || !image) {
            res.status(404);
            res.send();
            return;
        }
        
        if(!image.thumb){
            
            var fullSizeName = './tmp/' + objectId + '.jpg';
            var thumbName    = './tmp/' + objectId + '_thumb.jpg';
            fs.writeFile(fullSizeName, image.image.toString(), 'base64', function(err){
                if(err){res.send({error:err}); return;}
               
                lwip.open(fullSizeName, function(err, origImage){
                    if(err){res.send({error:err}); return;}
                    var cropSize = Math.min(origImage.height(), origImage.width());
                    origImage.batch()
                        .crop(cropSize, cropSize)
                        .resize(200, 200)
                        .writeFile(thumbName, function(err){
                            if(err){res.send({error:err}); return;}
                            fs.readFile(thumbName, 'base64', function(err, data){
                                if(err){res.send({error:err}); return;}
                                image.thumb = data;
                                image.save((err) => {
                                    if(err){res.send({error:err}); return;}
                                                res.writeHead(200, {
                                                'Content-Type': 'image/jpeg'
                                                });
                                    res.end(new Buffer(image.thumb.toString(), 'base64')); 
                                    fs.unlink(fullSizeName);
                                    fs.unlink(thumbName);
                                });
                            });
                        });
                });
            }); 
        }else{
            res.writeHead(200, {
                'Content-Type': 'image/jpeg'
            });
            res.end(new Buffer(image.thumb.toString(), 'base64'));    
        }
    });
};

// var addArtwork = function(req, res) {
//     if (!req.body) throw new Error("Empty form");
//     var form = req.body;
//     var files = req.files;

//     var artwork = new Artwork({
//         url: form.url,
//         name: form.name,
//         description: form.description,
//         location: {
//             lat: form.location_lat,
//             lng: form.location_lng,
//             address: form.location_address
//         },
//         status: {
//             code: form.status_code,
//             name: form.status_name
//         },
//         icon: form.icon
//     });

//     var imagesIds = files.map(function(it){return new ObjectId()}); //generate Ids for each image
//     var imagesToSave = files.map(function(file, index, array) {
//         return new Image({
//             _id: imagesIds[index],
//             image: file.buffer
//         });
//     });

//     Image.create(imagesToSave, function(err, doc) {
//         if (err) throw new Error('Cannot put images to DB');
//         var artists = [];
//         var photos = [];
//         files.forEach(function(file, index, array) {
//             var pair = file.fieldname.split("_");
//             if (pair[0] === 'artist') {
//                 var artist = new Artist({
//                     name: form['artist_name' + pair[1]],
//                     photo: imagesIds[index]
//                 });
//                 artists.push(artist);
//             } else if (pair[0] === 'photo') {
//                 var photo = new Photo({
//                     title: form['photo_title' + pair[1]],
//                     image: imagesIds[index]
//                 });
//                 photos.push(photo);
//             }
//         });
        
//         Artist.create(artists, function(err, doc){
//             if(err) throw new Error('Cannot insert artists');
//             Photo.create(photos, function(err, doc){
//                 if(err) throw new Error('Cannot insert photos');
//                 artwork.artists = artists;
//                 artwork.photos = photos;
//                 artwork.save(function(err) {
//                   if(err) throw new Error('Cannot save artwork');
//                   res.status(200);
//                   res.json(artwork);
//                 });
//             });
//         });
        
//     });
// };
// function importData(json, callback) {
//     var downloadImage = function(url, callback){
//         var requestOptions = {
//             encoding: 'base64',
//             method: "GET",
//             uri: url
//         };
//         request(requestOptions, function(err, res, body) {
//             if(!err && res.statusCode == 200){
//                 callback(null, body);
//             }else{
//                 callback(err, null);
//             }
//         })
//     };
    
//     var saveImage = function(err, image, callback){
//         if(!err && image){
//             var img = new Image({
//                 image: image
//             });
//             img.save(function(err){
//                 if(!err){
//                     callback(null, img._id);
//                 }else{
//                     callback(err, null);
//                 }
//             });
//         }else{
//             callback(err, null);
//         }
//     };
//     var saveArtist = function(name, photo_url, callback){
//              var artist = new Artist({
//                  name: name
//              });
//              artist.save(function(err) {
//                  if(!err){
//                      callback(null, artist);
//                  }else{
//                      callback(err, null);
//                  }
//              });
//     };
    
//     var savePhoto = function(name, photo_url, callback){
//         if(photo_url){
//             downloadImage(photo_url, function(err, image){
//                 saveImage(err, image, function(err, id){
//                     if(err){
//                         callback(err, null);
//                     }
//                     var photo = {
//                         name: name
//                     };
//                     if(id) photo.image = id;
//                     callback(null, photo);
//                 }); 
//             });
//         }else{
//             var photo = { name: name };
//             callback(null, photo);
//         }
//     };
    
//     json.forEach(function(art, index, array) {
//         saveArtist(art.artist, null, function(err, artist){
//             if(!err){
//                 savePhoto(art.name, art.image, function(err, photo){
//                     if(!err){
//                         var artwork = new Artwork({
//                             url: art.site || "",
//                             name: art.name || "",
//                             description: art.description || "",
//                             deployDate: (art.year),
//                             location: {
//                                 lat: art.location.lat || "0.0",
//                                 lng: art.location.lng || "0.0",
//                                 address: art.location.address || ""
//                                 },
//                             status: {
//                                 code: 0,
//                             },
//                             artists: [artist._id],
//                             photos: [photo],
//                         });
//                         artwork.save(function(err) {
//                             if (!err) console.log('Artwork ' + index + ' saved');
//                         });
//                     }
//                 });
//             }
//         });
//     });
//     callback();
// };

module.exports.getImage = getImage;
module.exports.getThumb = getThumb;
module.exports.getArtworks = getArtworks;
module.exports.addArtwork = addArtwork;
module.exports.deleteArtwork = deleteArtwork;
