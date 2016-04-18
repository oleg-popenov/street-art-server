# street-art-server
Opensource Node.js backend for StreetArtView project

##API
- **GET** __/artworks/__

```
{
	createdAt: long,
	updatedAt: long,
	url : "http://www.website.com",
	name : "string",
	description : "string",
	photos : [{
			name : "string",
			image : "http://www.website.com/image.jpg"
		}
	],
	artists : [{
			name : "string",
			id : "string"
		}
	],
	status : {
		code : 0,
		name : "string"
	},
	location : {
		lat : 0.000000,
		lng : 0.000000,
		address : "string"
	},
	deployDate : "2014-02-01T00:00:00.000Z",
	id : "string"
},
```
