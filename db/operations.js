var schemas = require("./schemas.js");

var Artwork = schemas.Artwork

var getArtworks = function (res) {
    Artwork
        .find({}, function(error, result){
            if(error){
                throw new Error(error)
            }
            res.status(200);
            res.json(result);
        });
}

var addArtwork = function (req, res){
    if(!req.body) throw new Error("Empty form")
    var form = req.body
    var artwork = new Artwork ({
    url: form.url,
    name: form.name,                                   
    description: form.description,
    location:{ 	                                    
        lat: form.location_lat,                                
        lng: form.location_lng,                                
        address: form.location_address
    },
    status: {                                       
        code: form.status_code,
        name: form.status_name 
    },                                 
    artists: [{
        name: form.artist_name,
        photo: form.artist_photo
    }],                              
    photos:	[{
        title: form.photo_title,
        thumbnail: form.photo_thumbnail,
        fullres: form.photo_fullres,  
        blurred: form.photo_blurred
    }],
    icon: form.icon
    });
    artwork.save(function (err) {
        if (err) {
            throw new Error(err)
        } else {
            res.status(200);
            res.json(artwork);
        }
});
}

module.exports.getArtworks = getArtworks;
module.exports.addArtwork  = addArtwork;