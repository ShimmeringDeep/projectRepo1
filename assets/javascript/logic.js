// Initialize Firebase
var config = {
	apiKey: "AIzaSyAo6OTFSK9YxITXg6wBELibFtbjiauhWak",
	authDomain: "damojo-1529524386895.firebaseapp.com",
	databaseURL: "https://damojo-1529524386895.firebaseio.com",
	projectId: "damojo-1529524386895",
	storageBucket: "",
	messagingSenderId: "894180044792"
};
firebase.initializeApp(config);

var database = firebase.database() // firebase variables


const colors = ["Orange", "Green", "Blue", "Red", "Purple", "White", "Yellow"]

const locKey = "AIzaSyAS7eVhjgd7vDmyAMGzCzygJ2q1sf1kXKo" //geolocation API key for later implementation (ajax call working at bottom)
const eventkey = "WVV7pQ6XZXdVrR9r" //eventful API key

const spinner = `
<div class="spinner">
  <div class="rect1"></div>
  <div class="rect2"></div>
  <div class="rect3"></div>
  <div class="rect4"></div>
  <div class="rect5"></div>
</div>
`;


$("#submit").on("click", function (e) { //submit button click event (ajax call for eventful and DOM population happens in here)
	e.preventDefault();
	let eventUrl = "https://api.eventful.com/json/events/search" //query url for eventful
	var locationInput = $("#eventLocationQuery").val().trim(); //grabs text value from the text imput field
	$("#eventLocationQuery").val("") //clears the text field on next click

	eventUrl += '?' + $.param({ //parameters for eventful query (we need a few more of these to make the returns cleaner)
		'app_key': eventkey,
		'location': locationInput,
		'date': 'thisweek',
		'category': 'music , comedy, festivals_parades, food, art, holiday, singles_social, outdoors_recreation, sports',
		'sort_order': 'popularity',
		'mature': 'normal',
		'page_size': 25,

	})

	$.ajax({
		url: eventUrl,
		method: 'GET',

		// dataType: 'jsonp',
		// Creates a f(x) that runs while the Ajax call is being completed. the f(x) will loop through the #primaryResults ID and removed each child node.
		beforeSend: function() {
			const primaryResults = document.querySelector('#primaryResults');
			while (primaryResults.firstChild) {
				primaryResults.removeChild(primaryResults.firstChild);
			}
			
			primaryResults.innerHTML += spinner; // Populate the #primaryResults ID with the CSS spinner
		},
		// Creates a f(x) that deletes the CSS spinner as soon as the Ajax call is done
		complete: function() {
			document.querySelector('.spinner').style.display = 'none';
		}
	}).then(function (result) {//after ajax query to eventful
		var events = result.events.event; //grabs the location in the result where the events from our query are stored
		console.log(events);
		database.ref().once('value', function (snapshot) {

			for (var i = 0; i < events.length; i++) { //for loop populates the DOM and firebase with our returned events
				var event = events[i]; //grabs the event in the event array at location [i]
				var eventObj = {
					title: event.title,
					venue: event.venue_name,
					start: moment(event.start_time).format('lll'),
					address: event.venue_address,
					description: event.description,
					eventID: event.id,
					color: colors[Math.floor(Math.random() * colors.length)],
					attendees: 0,
					lat: event.latitude,
					long: event.longitude,
					url: event.url
				};

				var checkArr = [];
				snapshot.forEach(function (childSnapshot) {
					if (childSnapshot.val().eventID === event.id) {
						checkArr.push(childSnapshot.val());
					}
				});

				if (checkArr.length > 0) {
					console.log(checkArr[0]);
					eventObj = checkArr[0];

					let results = `
					  <div data-event-\id\="${event.id}" class="results">
					  	<div>
					  		<p><span class="bold">title:</span> ${eventObj.title}</p>
					  		
					  		<p><span class="bold">time:</span> ${eventObj.start}</p>
					  		
					  		<p><span class="bold">venue:</span> ${eventObj.venue}</p>
					  	</div>
					  	
					  	<div class="rightModalSection">
					  		<p><span class="bold">attendees:</span> ${eventObj.attendees}</p>
					  		
					  		<p><span class="bold">wristband color:</span> ${eventObj.color}</p>
					  		
					  		<button class="button small openModal" data-open="${event.id}">More Info</button>
					  	</div>
					  </div>
					  <hr />
					  `;

					document.querySelector('#primaryResults').innerHTML += results;
				} else {
					let results = `
                   	<div data-event-\id\="${event.id}" class="results">
                   		<div>
                   			<p><span class="bold">title:</span> ${eventObj.title}</p>
                   				  		
                   			<p><span class="bold">time:</span> ${eventObj.start}</p>
                   				  		
                   			<p><span class="bold">venue:</span> ${eventObj.venue}</p>
                   		</div>
                   				  	
                   		<div class="rightModalSection">
                   			<p><span class="bold" >attendees:</span> ${eventObj.attendees}</p>
                   				  		
                   			<p><span class="bold">wristband color:</span> ${eventObj.color}</p>
                   				  		
                   			<button class="button small openModal" data-open="${event.id}">More Info</button>
                   		</div>
                   	</div>
                   	<hr /> `;

					document.querySelector('#primaryResults').innerHTML += results;


					database.ref().push(eventObj)
				}
			}
		});
	});
});

$("body").on("click", ".openModal", function (event) {
	let modalObj;
	let buttonId = $(this).attr('data-open');
	database.ref().once('value').then(function (snapshot) {

		snapshot.forEach(function (childSnapshot) {
			if (childSnapshot.val().eventID === buttonId) {
				modalObj = childSnapshot.val();
			}
		});


		let modals = `
		<div class="reveal" \id\="${modalObj.eventID}" data-reveal data-animation-\in\="fade-in" data-animation-\out\="fade-out">
			<div class="results">
				<div>
					<p><span class="bold">title:</span> ${modalObj.title}</p>
					
					<p><span class="bold">address:</span> ${modalObj.address}</p>
					
					<p><span class="bold">venue:</span> ${modalObj.venue}</p>
				</div>
				
				<div class="rightModalSection">
					<p><span class="bold">time:</span> ${modalObj.start}</p>
					<p><span class="bold">wristband color:</span>  <span style="color: ${modalObj.color};">${modalObj.color}</span></p>
			  		<a href="${modalObj.url}" class="button tiny" target="_blank">Check Out Their Website!</a>
			  	</div>
				
				<div \id\="googleMap">
					<div class="map" \id\="map${modalObj.eventID}"></div>
				</div>
				
				<div \id\="attendee${modalObj.eventID}">

					<p class="rsvp"><span class="bold">attendees:</span> <span \id\="attendees${modalObj.eventID}">${modalObj.attendees}</span></p>
				</div>
				
				<div \id\="rsvp${modalObj.eventID}" class="rightModalSection">
					<button class="button tiny rsvp" data-event-id="${modalObj.eventID}">RSVP now</button>


				</div>
			</div>
			
			<button class="close-button button" data-close aria-label="Close modal" type="button"><span aria-hidden="true">&times;</span></button>
		</div>
	`;

		document.body.innerHTML += modals;
		$("#" + modalObj.eventID).foundation();
		$("#" + modalObj.eventID).foundation('open');

		var mapID = "map" + modalObj.eventID;
		var mapDiv = document.getElementById(mapID);
		var location = { lat: parseFloat(modalObj.lat), lng: parseFloat(modalObj.long) };

		function initMap() {
			console.log('map' + modalObj.eventID)
			//The location of Uluru
			// The map, centered at Uluru
			var map = new google.maps.Map(
				mapDiv, { zoom: 12, center: location });
			//The marker, positioned at Uluru
			var marker = new google.maps.Marker({ position: location, map: map });
		}

		initMap();
	});


}); // end of the .openModal click event

$("body").on("click", ".rsvp", function (event) {
	let rsvpObj;
	let buttonId = $(this).attr('data-event-id');
	database.ref().once('value').then(function (snapshot) {


		var fbkey;
		snapshot.forEach(function (childSnapshot) {
			if (childSnapshot.val().eventID === buttonId) {
				rsvpObj = childSnapshot.val();
				fbkey = childSnapshot.key;
			}
		});
		let attendeeCount = parseInt(rsvpObj.attendees);
		attendeeCount ++;
		database.ref().child(fbkey).update({ attendees: attendeeCount });
		$('#attendees'+rsvpObj.eventID).text(attendeeCount);

	});
});


$("#submit").keyup(function(event) {
    if (event.keyCode === 13) {
        $("#submit").click();
    }

});

let locateUrl = "https://www.googleapis.com/geolocation/v1/geolocate?key=" + locKey //geolocation url

$.ajax({ //geolocation ajax request
	url: locateUrl,
	method: 'POST',
}).then(function (result) {
	console.log(result); //returns latitude and longitude and accuracy
})