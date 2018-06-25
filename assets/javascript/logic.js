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

                console.log("after for each loop");

                if (checkArr.length > 0) {
                    console.log(checkArr[0]);
                    eventObj = checkArr[0];

                    var newRow = $("<tr>").attr("class", "eventRow").attr("data-event-id", event.id).attr("data-open", event.id); //creates a new row with a class for styling and scripting and a data with the unique ID of the event stored within it
                    titleD = $("<td>").text(eventObj.title); //create table data elements with text content
                    dateD = $("<td>").text(eventObj.start);
                    colorD = $("<td>").text(eventObj.color); //TO DO get this variable from firebase instead
                    venueD = $("<td>").text(eventObj.venue);
                    attendeesD = $("<td>").text(eventObj.attendees); //TO DO get this variable from firebase instead
                    newRow.append(titleD, dateD, colorD, venueD, attendeesD); // appends that text content to the newRow we declared earlier
                    $("#results").append(newRow) //appends that newRow (along with its children) to the DOM             
                }
                else {
                    var newRow = $("<tr>").attr("class", "eventRow").attr("data-event-id", event.id).attr("data-open", event.id); //creates a new row with a class for styling and scripting and a data with the unique ID of the event stored within it
                    titleD = $("<td>").text(eventObj.title); //create table data elements with text content
                    dateD = $("<td>").text(eventObj.start);
                    colorD = $("<td>").text(eventObj.color); //TO DO get this variable from firebase instead
                    venueD = $("<td>").text(eventObj.venue);
                    attendeesD = $("<td>").text(eventObj.attendees); //TO DO get this variable from firebase instead
                    newRow.append(titleD, dateD, colorD, venueD, attendeesD); // appends that text content to the newRow we declared earlier
                    $("#results").append(newRow) //appends that newRow (along with its children) to the DOM

                    database.ref().push(eventObj)
                }
            }
        });
    })
});


//click event for modal (-comment and code right below done by mohammed)
$(".eventRow").on("click", function (event) {
    //modal activation goes here    
    console.log("This works");
});


let locateUrl = "https://www.googleapis.com/geolocation/v1/geolocate?key=" + locKey //geolocation url

$.ajax({ //geolocation ajax request
    url: locateUrl,
    method: 'POST',
}).then(function (result) {
    console.log(result); //returns latitude and longitude and accuracy
})