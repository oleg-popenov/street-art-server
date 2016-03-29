var mongoose    = require('mongoose');

mongoose.connect('mongodb://' + process.env.IP + '/test');
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
 
var Photo = new Schema({    // id	String	Unique identity of the object
    title: String,          // title	String, optional	Title of the photo
    image: {type: Schema.Types.ObjectId, ref: 'Image'} 
    //thumbnail: String,      // thumbnail	URL	Thmbnail image (150x200)
    //fullres: String,        // fullres	URL	Full resolution photo
    //blurred: String         // blurred	URL, optional	Blurred variant of full resolution photo
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
        code: Number, //status.code	Integer	Code of artwork status. 0 – artwork is available, 1 – artwork is stolen, 2 – artwork is destroyed
        name: String 
    },                                 
    artists: [Artist],                              //artists	Array, optional	Artists that performed the artwork (may be empty)
    photos:	[Photo],                                //photos	Array	Photos of the artwork
    icon: Buffer                                    //icon	Object	Main photo of the artwork
});

Artwork.options.toJSON = {
    transform: function(doc, ret, options) {
        if(ret.location.lat == null) delete ret.location.lat;
        if(ret.location.lng == null) delete ret.location.lng;
        //status name
        if(ret.status.code == 0) ret.status.name = 'artwork is available';
        else if(ret.status.code == 1) ret.status.name = 'artwork is stolen';
        else if(ret.status.code == 2) ret.status.name = 'artwork is destroyed';
        
        ret.artists.forEach(function(artist, index, array){
            delete artist._id;
            artist.photo = 'https://street-art-server-pos1985.c9users.io/artworks/image/' + artist.photo;
        });
        
        ret.photos.forEach(function(photo, index, array) {
            delete photo._id;
            photo.image = 'https://street-art-server-pos1985.c9users.io/artworks/image/' + photo.image;
        });
        
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
module.exports.Photo    = mongoose.model('Photo', Photo);
module.exports.Artist   = mongoose.model('Artist', Artist);
module.exports.Artwork  = mongoose.model('Artwork', Artwork);
module.exports.ObjectId = mongoose.Types.ObjectId;