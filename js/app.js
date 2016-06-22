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
* Global Variables
**/
var map,
	infowindow,
	placeList = ko.observableArray([]);

/**
* Define Place Class
**/
var Place = function(data) {
	var self = this;

	self.name = data.name;
	self.loc = {lat: data.latitude, lng: data.longitude};
	self.createMarker = function(){
    	self.newMarker = new google.maps.Marker({
		    map: map,
		    animation: google.maps.Animation.DROP,
		    position: self.loc
 		}).addListener('click', function(info){
 			self.clickedPlace();
 		});
	};
	self.clickedPlace = function(){
		infowindow.open(map);
		infowindow.setPosition( self.loc );
		infowindow.setContent(data.name)
		map.setCenter( self.loc );
		self.animateMarker();
	};
	self.animateMarker = function(){
		// Check all other markers and set their animation to none
		placeList().forEach(function(info){
			var marker = info.newMarker.Mb;
    		if (marker.animation != 'null'){
    			marker.setAnimation('null');
    		}
    	});

		// Animate current marker
		self.newMarker.Mb.setAnimation(google.maps.Animation.BOUNCE);
	}

};


/**
* Create ViewModel
**/
function viewModel() {

	var self = this;

	// Push markers to observable array in global scope
    places.forEach(function(info){
    	placeList.push( new Place(info) );
    });

    self.filter = ko.observable('');
    self.filterResults = ko.computed(function(){

    });

};

// Activates knockout.js
ko.applyBindings(new viewModel());


/**
* Google Map
**/

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

   	// Generate markers based on same observable array in list
 	placeList().forEach(function(info){
    	 info.createMarker();
    });

 	// Reinit map when window resizes to help with responsive layout
    google.maps.event.addDomListener(window, 'resize', initMap);

};





/**
* General Functionality
**/

// Initialize Foundation Scripts
$(document).foundation();