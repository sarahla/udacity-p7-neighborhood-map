/**
* Data
**/

var places = [
	{
		name: 'Carlos & Sarah\'s New Place',
		latitude: 41.7677606,
		longitude: -72.6970694
	},
	{
		name: 'Carlos\' Old Place',
		latitude: 41.7283519,
		longitude: -72.6790308
	},
	{
		name: 'Casona',
		latitude: 41.7372315,
		longitude: -72.6737393
	},
	{
		name: 'Elizabeth Park',
		latitude: 41.77388,
		longitude: -72.721249
	},
	{
		name: 'Brazil Grill',
		latitude: 41.7565039,
		longitude: -72.7142382
	},
	{
		name: 'Friendly\'s',
		latitude: 41.7545085,
		longitude: -72.6835029
	}
]

/**
* Define Place Class
**/
var Place = function(data) {

	var self = this;

	this.name = data.name;
	this.loc = {lat: data.latitude, lng: data.longitude};

	this.getContent = (function(){
		// var wikipediaURL = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + self.name + '&prop=revisions&rvprop=content&format=json&limit=1';
		var flickrURL = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=2e4da4d7b00160fa26b6c7b5419a9dd1&format=json&lat=41.77388&lon=-72.721249&radius=.1&radius_units=mi';

		jQuery.ajax({
            url: flickrURL,
            dataType: 'jsonp',
            jsonp: 'jsoncallback'
        }).done(function(response){

        	var photo = '';

        	// Get random number between 1-99 to pick random photo
        	var randomImage = Math.floor(Math.random() * 250) + 1

        	if (response){
        		photoOwner = response.photos.photo[randomImage].owner;
        		photoId = response.photos.photo[randomImage].id;
        		photoTitle = response.photos.photo[randomImage].title;
        		photo += '<img src="https://www.flickr.com/photos/' + photoOwner + '/' + photoId + ' alt="' + photoTitle + '">';
        	}

        	console.log(response);

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

		// open the info window
		infowindow.open(map);

		// set the infowindow's position
		infowindow.setPosition( self.loc );

		// set the infowindow's content
		infowindow.setContent(data.name)

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