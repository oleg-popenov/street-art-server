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
    var artwork = new Artwork ({
    url: "http://tophdimgs.com/data_images/wallpapers/3/335494-artwork.jpg",                                    
    name: "Artwork name",                                   
    description: "Some description",                            
    location:{ 	                                    
        lat: 20,                                
        lng: 20,                                
        address: "NN"
    },
    status: {                                       
        code: 1,
        name: "Status name" 
    },                                 
    artists: [{
        name: "Vasya Pupkin",
        photo: "http://tophdimgs.com/data_images/wallpapers/3/335494-artwork.jpg"
    }],                              
    photos:	[{
        title: "Super photo",
        thumbnail: "http://tophdimgs.com/data_images/wallpapers/3/335494-artwork.jpg",
        fullres: "http://tophdimgs.com/data_images/wallpapers/3/335494-artwork.jpg",  
        blurred: "http://tophdimgs.com/data_images/wallpapers/3/335494-artwork.jpg"
    }]
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