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


$("#submit").on("click", function (e) { //submit button click event (ajax call for eventful and DOM population happens in here)

    let eventUrl = "http://api.eventful.com/json/events/search" //query url for eventful
    var locationInput = $("#eventLocationQuery").val().trim(); //grabs text value from the text imput field
    $("#eventLocationQuery").val("") //clears the text field on next click

    eventUrl += '?' + $.param({ //parameters for eventful query (we need a few more of these to make the returns cleaner)
        'app_key': eventkey,
        'location': locationInput,
        'date': 'thisweek',
        'category': 'music , comedy, festivals_parades, food, art, holiday, singles_social, outdoors_recreation, sports',
        'sort_order': 'popularity'

    })

    $.ajax({
        url: eventUrl,
        method: 'GET',
        dataType: 'jsonp'
    }).then(function (result) {//after ajax query to eventful
        var events = result.events.event; //grabs the location in the result where the events from our query are stored
        console.log(events);
        database.ref().once('value', function (snapshot) {

            for (var i = 0; i < events.length; i++) { //for loop populates the DOM and firebase with our returned events
                var event = events[i]; //grabs the event in the event array at location [i]
                var eventObj = {
                    title: event.title,
                    venue: event.venue_name,
                    start: event.start_time,
                    address: event.venue_address,
                    description: event.description,
                    eventID: event.id,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    attendees: 0,
                    lat: event.latitude,
                    long: event.longitude
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
					  		
					  		<button class="button small openModal" data-open="${event.id}">More Info!</button>
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
                   			<p><span class="bold">attendees:</span> ${eventObj.attendees}</p>
                   				  		
                   			<p><span class="bold">wristband color:</span> ${eventObj.color}</p>
                   				  		
                   			<button class="button small openModal" data-open="${event.id}">More Info!</button>
                   		</div>
                   	</div>
                   	<hr /> `;
                   
                   	document.querySelector('#primaryResults').innerHTML += results;

                    database.ref().push(eventObj)                  }
            }
        });
    });
});
 


$("body").on("click", ".openModal", function (event) {
	let modalObj;
	let buttonId = $(this).attr('data-open');
	database.ref().once('value').then(function(snapshot) {
		
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
					<p><span class="bold">wristband color:</span> ${modalObj.color}</p>
			  		<a href="${modalObj.url}" class="button tiny" target="_blank">Check Out Their Website!</a>
			  	</div>
				
				<div \id\="googleMap">
					<div \id\="map"></div>
				</div>
				
				<div \id\="attendee">
					<p><span class="bold">attendees:</span> ${modalObj.attendees}</p>
				</div>
				
				<div \id\="rsvp" class="rightModalSection">
					<button class="button tiny">RSVP now!</button>
				</div>
			</div>
			
			<button class="close-button button" data-close aria-label="Close modal" type="button"><span aria-hidden="true">&times;</span></button>
		</div>
	`;
	
	document.body.innerHTML += modals;
	$("#"+ modalObj.eventID).foundation();
	$("#"+ modalObj.eventID).foundation('open');
	
	initMap (modalObj.lat, modalObject.long)
	
    });
	
	
}); // end of the .openModal click event



function initMap(latitude, longitude) {
  var markerLocation = {lat: latitude, lng: longitude};
  var map = new google.maps.Map(
  document.getElementById('map'), {zoom: 12, center: markerLocation});
  
  var marker = new google.maps.Marker({position: markerLocation, map: map});
}






let locateUrl = "https://www.googleapis.com/geolocation/v1/geolocate?key=" + locKey //geolocation url

$.ajax({ //geolocation ajax request
    url: locateUrl,
    method: 'POST',
}).then(function (result) {
//    console.log(result); //returns latitude and longitude and accuracy
})