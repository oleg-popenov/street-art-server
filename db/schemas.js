var mongoose    = require('mongoose');

mongoose.connect(process.env.MONGOLAB_URI);
var db = mongoose.connection;

db.on('error', function (err) {
    console.log('connection error:' + err.message);
});
db.once('open', function callback () {
    console.log("Connected to DB!");
});

var Schema = mongoose.Schema;

// Schemas
/**
 * Schemas by Mongoose doc.
 * http://mongoosejs.com/docs/guide.html
 **/
 
var Image = new Schema({
    image: Buffer
}); 
 
var Artist = new Schema({   //id	String	Unique identity of the object
    name: String,           //name	String	Username of the artist
    photo: {type: Schema.Types.ObjectId, ref: 'Image'}            //photo	URL	Photo of the artist    
});

var Artwork = new Schema({                          //id	String	Unique identity of the artwork
    url: String,                                    //url	String	Public web URL to the artwork
    name: String,                                   //name	String	Title of the artwork
    description: String,                            //description	String	Artwork description
    deployDate:	{ type: Date, default: Date.now },  //deployDate	String	Date when artwork was published/created
    location:{ 	                                    //location	Object	Artwork location information
        lat: Number,                                //lat	Float	Geo latitude
        lng: Number,                                //lng	Float	Geo longitude
        address: String                             //address	String, optional	Postal address of artwork location
    },
    status: {                                       //status	Object	Artwork status
        code: {                                     //status.code	Integer	Code of artwork status.
            type: Number,                           // 0 – artwork is available,
            min: 0,                                 // 1 – artwork is stolen,
            max: 2                                  // 2 – artwork is destroyed
        },                                  
        name: String 
    },                                 
    artists: [{                                     //artists	Array, optional	Artists that performed the artwork (may be empty)
            type: Schema.Types.ObjectId,
            ref: 'Artist'
    }],                              
    photos:	[{                                      //photos	Array	Photos of the artwork
        name: String,
        image : {
            type : Schema.Types.ObjectId,
            ref: 'Image'
        }
    }]
});

Artwork.options.toJSON = {
    transform: function(doc, ret, options) {
        if(!ret.location.lat) delete ret.location.lat;
        if(!ret.location.lng) delete ret.location.lng;
        //status name
        if(ret.status.code == 0) ret.status.name = 'artwork is available';
        else if(ret.status.code == 1) ret.status.name = 'artwork is stolen';
        else if(ret.status.code == 2) ret.status.name = 'artwork is destroyed';
        
        ret.artists.forEach(function(artist, index, array){
            artist.id = artist._id;
            delete artist._id;
            delete artist.__v;
            if(!artist.image){
                delete artist.image;
            }else{
                artist.image = 'https://street-art-server-pos1985.c9users.io/artworks/image/' + artist.image;
            }
        });
        
        ret.photos.forEach(function(photo, index, array) {
            delete photo._id;
            delete photo.__v;
            if(!photo.image){
                delete photo.image;
            }else{
                photo.image = 'https://street-art-server-pos1985.c9users.io/artworks/image/' + photo.image;
            }
            
        });
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
};

/*
new Schema({
    name: String,
    array: [String]
    date: Date,
    icon: Buffer,
    types: [{ type : Schema.Types.ObjectId, ref: 'Class' }],
      it: [{
      what: {type: Schema.Types.ObjectId, ref: 'Class'},
      amount: Number
  }
  login: { type : String, unique: true},
      reg_date: {type : Date, default : Date.now },
});
*/
module.exports.Image    = mongoose.model('Image', Image);
module.exports.Artist   = mongoose.model('Artist', Artist);
module.exports.Artwork  = mongoose.model('Artwork', Artwork);
module.exports.ObjectId = mongoose.Types.ObjectId;