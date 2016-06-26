/**
* Define Global Variables
**/
var placeList,
	activePlace,
	map,
	infowindow;
	
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
		name: 'Mark Twain House',
		latitude: 41.767066,
		longitude: -72.700964
	},
	{
		name: 'Bushnell Park',
		latitude: 41.764119,
		longitude: -72.683039
	},
	{
		name: 'Wadsworth Atheneum',
		latitude: 41.763893,
		longitude: -72.674024
	},
	{
		name: 'Riverside Park',
		latitude: 41.776326,
		longitude: -72.664807
	},
	{
		name: 'Liam E. McGee Park',
		latitude: 41.771397,
		longitude: -72.6856313
	}

];

/**
* Define Place Class
**/
var Place = function(data) {

	var self = this;

	this.name = data.name;
	this.lat = data.latitude;
	this.lon = data.longitude;
	this.loc = {lat: data.latitude, lng: data.longitude};
	this.activeClass = ko.observable(false);
	this.photo = '<div class="loading-graphic"></div>';

	this.getContent = function(){

		var flickrURL = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=2e4da4d7b00160fa26b6c7b5419a9dd1&format=json&lat=' + self.lat + '&lon=' + self.lon + '&radius=.1&radius_units=mi';

		jQuery.ajax({
			url: flickrURL,
			dataType: 'jsonp',
			jsonp: 'jsoncallback'
		}).done(function(response){

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
					var photoLink = 'https://www.flickr.com/photos/' + photoOwner + '/' + photoID;

					// set desired thumbnail Size
					var photoSize = 'q';

					// set photo html
					self.photo = '<img src="https://farm'+ photoFarm +'.staticflickr.com/'+ photoServer +'/'+ photoID +'_'+ photoSecret +'_' + photoSize + '.jpg" alt="' + photoTitle + '"> <br><small>Photo courtesy of <a class="attribution-link" target="_blank" href="' + photoLink + '" title="Photo Attribution">Flickr</a>.</small>';
				}

				else{

					// if no photo is available for this place, display text
					self.photo = 'No Images Here! Check back later.';

				}
			}

		}).fail(function() {

			// if API is broken, log error and display text
			console.log("error in ajax call to flickr api");
			self.photo = 'There\'s a problem with Flickr right now.';

		}).always(function() {
			
			//set infowindow content
			infowindow.setContent('<p class="place-name">' + self.name + '</p>' + self.photo);

			// open the info window
			infowindow.open(map);

			// set the infowindow's position
			infowindow.setPosition( self.loc );
		
		});

	};

	// create marker and immediately invoke function
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

		// push location to bounds array
		self.latLng = new google.maps.LatLng(parseFloat(self.lat), parseFloat(self.lon));
		map.bounds.extend(self.latLng);

	})();

	// define what happens when you click this place
	this.clickedPlace = function(){

		// close offcanvas menu
		$('#offCanvas').foundation('close');
		
		// center the map around this location
		map.setCenter( self.loc );

		// make ajax request when clicked
		self.getContent();

		// animate the marker
		self.animateMarker();

		// set this as active place
		activePlace(this);

		// reset active class if active
		placeList().forEach(function(place){

			if (place.activeClass() === true){
				place.activeClass(false);
			}

		});

		// set this active class
		self.activeClass(true);

	};

	// animate the marker when you click it
	this.animateMarker = function(){

		// check all other markers and set their animation to none
		placeList().forEach(function(place){

			if (place.newMarker.animation != 'null'){
				place.newMarker.setAnimation('null');
			}

		});

		// animate current marker
		self.newMarker.setAnimation(google.maps.Animation.BOUNCE);
		setTimeout(function(){ self.newMarker.setAnimation(null); }, 1400);

	};

};


/**
* Create ViewModel
**/

function viewModel() {

	var self = this;

	 // fit map to new bounds
	map.fitBounds(map.bounds);

	// create observable array for list of places
	placeList = ko.observableArray([]);

	// create observable for active place
	activePlace = ko.observable('');

	// Push markers to observable array
	places.forEach(function(info){

		placeList.push( new Place(info) );

	});

	// get searchterm from text input
	this.searchTerm = ko.observable('');

	// filter places on map based on searchterm
	this.filterResults = ko.computed(function(){

		// return a list of locations filtered by the searchTerm
		return placeList().filter(function (location) {

			var display = true;

			if (self.searchTerm()){

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

			// close infowindow
			infowindow.close();

			return display;

		});

	});

}

/**
* Initialize App
**/

function initApp(){
	// activates knockout.js
	ko.applyBindings(new viewModel());

}

/**
* Google Map
**/

function initMap() {
	
	var initialCenter = {lat: 41.771397, lng: -72.6856313};
	
	// initialize Google Map
	map = new google.maps.Map(document.getElementById('map'), {
		center: initialCenter,
		zoom: 14
	});

	// initialize bounds variable
	map.bounds = new google.maps.LatLngBounds();

	// create infoWindow
	infowindow = new google.maps.InfoWindow({
		content: '',
		infoposition: {},
		pixelOffset: {width: -2, height: -30}
	});

	// center map when window resizes to help with responsive layout
	google.maps.event.addDomListener(window, 'resize', function(){
		
		// set center of map
		map.setCenter(initialCenter);
		
		 // fit map to new bounds
		map.fitBounds(map.bounds);

	});

	// call function to initialize app
	initApp();

}

// error handling for map
function googleMapsApiErrorHandler(){
	console.log('Error: Google maps API');
	$('#map').append('<p class="map-error">We\'re having trouble loading Google Map. Check back soon!</p>');
}

/**
* General Functionality
**/

// initialize foundation scripts
$(document).foundation();
