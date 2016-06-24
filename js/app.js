/**
* Data
**/

var places = [
	{
		name: 'Elizabeth Park',
		latitude: 41.7756223,
		longitude: -72.7166942
	},
	{
		name: 'Pope Park',
		latitude: 41.756013,
		longitude: -72.697787
	},
	{
		name: 'Bushnell Park',
		latitude: 41.764119,
		longitude: -72.683039
	},
	{
		name: 'Goodwin Park',
		latitude: 41.726256,
		longitude: -72.6992573
	},
	{
		name: 'Riverside Park',
		latitude: 41.776326,
		longitude: -72.664807
	},
	{
		name: 'Liam E. McGee Memorial Park',
		latitude: 41.771397,
		longitude: -72.6856313
	}

]

/**
* Define Place Class
**/
var Place = function(data) {

	var self = this;

	this.name = data.name;
	this.lat = data.latitude;
	this.lon = data.longitude;
	this.loc = {lat: data.latitude, lng: data.longitude};

	this.getContent = (function(){

		var flickrURL = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=2e4da4d7b00160fa26b6c7b5419a9dd1&format=json&lat=' + self.lat + '&lon=' + self.lon + '&radius=.1&radius_units=mi';

		jQuery.ajax({
            url: flickrURL,
            dataType: 'jsonp',
            jsonp: 'jsoncallback'
        }).done(function(response){

        	self.photo = '';

        	if (response){

        		// define image
        		var photo = response.photos.photo[0];

        		// check if image comes back undefined
        		if (typeof photo !== 'undefined'){

	        		// get image details
	        		var photoFarm = photo.farm;
	        		var photoServer = photo.server;
	        		var photoSecret = photo.secret;
	        		var photoOwner = photo.owner;
	        		var photoID = photo.id;
	        		var photoTitle = photo.title;

	        		// set desired thumbnail Size
	        		var photoSize = 'm';

	        		// set photo html
	        		self.photo = '<img src="https://farm'+ photoFarm +'.staticflickr.com/'+ photoServer +'/'+ photoID +'_'+ photoSecret +'_' + photoSize + '.jpg" alt="' + photoTitle + '">';
	        	}

	        	else{
	        		self.photo = 'No Images Here! Check back later.'
	        	};
        	};





        })

	})();

	// Create marker and immediately invoke function
	this.createMarker = (function(){

    	self.newMarker = new google.maps.Marker({
		    map: map,
		    animation: google.maps.Animation.DROP,
		    position: self.loc
 		});

    	// add click event listener to the marker
 		self.newMarker.addListener('click', function(){
 			self.clickedPlace();
 		});

	})();

	// Define what happens when you click this place
	this.clickedPlace = function(){

		// set the infowindow's position
		infowindow.setPosition( self.loc );

		// open the info window
		infowindow.open(map);

		// set the infowindow's content
		infowindow.setContent('<h3>' + self.name + '</h3>' + self.photo)

		// center the map around this location
		map.setCenter( self.loc );

		// animate the marker
		self.animateMarker();

	};

	// Animate the marker when you click it
	this.animateMarker = function(){

		// Check all other markers and set their animation to none
		placeList().forEach(function(marker){

    		if (marker.newMarker.animation != 'null'){
    			marker.newMarker.setAnimation('null');
    		}

    	});

		// Animate current marker
		self.newMarker.setAnimation(google.maps.Animation.BOUNCE);

	};

};


/**
* Create ViewModel
**/
function viewModel() {

	var self = this;

	// create observable array for list of places
	placeList = ko.observableArray([]);

	// Push markers to observable array
    places.forEach(function(info){

    	placeList.push( new Place(info) );

    });

    // Set default active place
    this.activePlace = ko.observable(placeList()[0] );

    // change the active place
    this.changePlace = function(clickedPlace){
		self.activePlace(clickedPlace);
	};

    // get searchterm from text input
    this.searchTerm = ko.observable('');

    // filter places on map based on searchterm
    this.filterResults = ko.computed(function(){

        // return a list of locations filtered by the searchTerm
        return placeList().filter(function (location) {

            var display = true;

            if (self.searchTerm() !== ''){

                // check if the place name contains the search term
                var termIndex = location.name.toLowerCase().indexOf(self.searchTerm().toLowerCase());

                if ( termIndex !== -1){
                    display = true;
                }

                else {
                    display = false;
                }

            }

            // toggle map marker based on the filter
            location.newMarker.setVisible(display);

            return display;

        });

    });

};


/**
* Google Map
**/

// Global vars for map function
var map,
	infowindow;

var initMap = function() {

	// Initialize Google Map
    map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 41.7484685, lng: -72.7022609},
		zoom: 14
    });

    // Create infoWindow
   	infowindow = new google.maps.InfoWindow({
		content: '',
		infoposition: {},
		pixelOffset: {width: -2, height: -30}
	});

 	// Reinit map when window resizes to help with responsive layout
    google.maps.event.addDomListener(window, 'resize', initMap);

};


var initApp = function(){
	initMap();

	// Activates knockout.js
	ko.applyBindings(new viewModel());
}



/**
* General Functionality
**/

// Initialize Foundation Scripts
$(document).foundation();