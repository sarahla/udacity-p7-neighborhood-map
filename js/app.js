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

	// Create marker and immediately invoke function
	this.createMarker = (function(){
    	
    	self.newMarker = new google.maps.Marker({
		    map: map,
		    animation: google.maps.Animation.DROP,
		    position: self.loc
 		});

 		self.newMarker.addListener('click', function(){
 			self.clickedPlace();
 		});

	})();

	this.clickedPlace = function(){
		infowindow.open(map);
		infowindow.setPosition( self.loc );
		infowindow.setContent(data.name)
		map.setCenter( self.loc );
		self.animateMarker();
	};
	this.animateMarker = function(){
		// Check all other markers and set their animation to none
		placeList().forEach(function(marker){
			
    		if (marker.newMarker.animation != 'null'){
    			marker.newMarker.setAnimation('null');
    		}
    	});

		// Animate current marker
		self.newMarker.setAnimation(google.maps.Animation.BOUNCE);
	}

};


/**
* Create ViewModel
**/
function viewModel() {

	var self = this;

	placeList = ko.observableArray([]);

	// Push markers to observable array
    places.forEach(function(info){
    	placeList.push( new Place(info) );
    });


    // Set Active Location
    this.activePlace = ko.observable(placeList()[0] );
    
    this.changePlace = function(clickedPlace){
		self.activePlace(clickedPlace);
	};

	console.log(activePlace());
    
    // Filter based on text input
    this.searchTerm = ko.observable('');
    this.filterResults = ko.computed(function(){

        // return a list of locations filtered by the searchTerm
        return placeList().filter(function (location) {
            
            var display = true;
            
            if (self.searchTerm() !== ''){
                
                // check if the location name contains the searchTerm
                if (location.name.toLowerCase().indexOf(self.searchTerm().toLowerCase()) !== -1){
                    display = true;
                }else {
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