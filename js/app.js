/**
* Data
**/

var places = [
	{
		name: 'Carlos & Sarah\'s New Place',
		latitude: 41.7484685,
		longitude: -72.7022609
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
* API Functionality
**/

// Initialize Google Map
var map,
	infowindow;

var initMap = function() {

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

 	places.forEach(function(info){
    	 var place = new Place(info);
    	 place.createMarker();
    });

    google.maps.event.addDomListener(window, 'resize', initMap);
}

var Place = function(data) {
	
	var self = this;

	this.name = data.name;
	this.loc = {lat: data.latitude, lng: data.longitude}
	this.createMarker = function(){
    var newMarker = new google.maps.Marker({
		    map: map,
		    animation: google.maps.Animation.DROP,
		    position: self.loc
 		}).addListener('click', function(){
 			self.clickedPlace();
 		});
	};
	this.clickedPlace = function(){
		infowindow.open(map);
		infowindow.setPosition( self.loc );
		infowindow.setContent(data.name)
		map.setCenter( self.loc );
	};

}

// Create ViewModel
function markerViewModel() {

	var self = this;

    //this.markerList = ko.observableArray([]);
    this.markerList = [];

    places.forEach(function(info){
    	self.markerList.push( new Place(info) );
    });

}

// Activates knockout.js
ko.applyBindings(new markerViewModel());


/**
* General Functionality
**/

// Initialize Foundation Scripts
$(document).foundation();