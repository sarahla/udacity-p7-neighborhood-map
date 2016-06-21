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

   	infowindow = new google.maps.InfoWindow({
			content: 'TESTING',
			infoposition: {lat: 41.7484685, lng: -72.7022609}
	});

    places.forEach(function(data, i){
    	var marker = new google.maps.Marker({
		    map: map,
		    animation: google.maps.Animation.DROP,
		    position: {lat: data.latitude, lng: data.longitude}
 		}).addListener('click', function(){
 			infowindow.open(map);
 			infowindow.setPosition( {lat: data.latitude, lng: data.longitude} );
 			console.log(infowindow.infowindowposition);
 		});
    });

    console.log(infowindow.position);

    google.maps.event.addDomListener(window, 'resize', initMap);
}


/**
* Knockout Functionality
**/


// Create place
var Place = function(data){
	this.name = data.name;
	this.loc = '{lat:' + data.latitude + ', lng:' + data.longitude + '}';
}

var Marker = function(data){
	this.name = data.name;
	this.loc = '{lat:' + data.latitude + ', lng:' + data.longitude + '}';
}

// Create ViewModel
function markerViewModel() {

	var self = this;

    //this.markerList = ko.observableArray([]);
    this.markerList = [];

    places.forEach(function(markerInfo){
    	self.markerList.push( new Place(markerInfo) );
    });
}

// Activates knockout.js
ko.applyBindings(new markerViewModel());


/**
* General Functionality
**/

// Initialize Foundation Scripts
$(document).foundation();