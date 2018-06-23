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


const colors = ["orange", "green", "blue", "red", "purple", "white", "yellow"]

const locKey = "AIzaSyAS7eVhjgd7vDmyAMGzCzygJ2q1sf1kXKo" //geolocation API key for later implementation (ajax call working at bottom)
const eventkey = "WVV7pQ6XZXdVrR9r" //eventful API key


$("#submit").on("click", function (event) { //submit button click event (ajax call for eventful and DOM population happens in here)

    let eventUrl = "http://api.eventful.com/json/events/search" //query url for eventful
    var locationInput = $("#eventLocationQuery").val().trim(); //grabs text value from the text imput field
    $("#eventLocationQuery").val("") //clears the text field on next click

    eventUrl += '?' + $.param({ //parameters for eventful query (we need a few more of these to make the returns cleaner)
        'app_key': eventkey,
        'location': locationInput

    })

    $.ajax({
        url: eventUrl,
        method: 'GET',
        dataType: 'jsonp'
    }).then(function (result) {//after ajax query to eventful
        var events = result.events.event; //grabs the location in the result where the events from our query are stored

        for (i = 0; i < events.length; i++) { //for loop populates the DOM and firebase with our returned events

            //TO DO!!! MAKE AN IF THEN STATEMENT THAT ONLY CREATES NEW FIREBASE ENTRIES FOR NON EXISTING EVENTS (so we don't overwrite color or attendance)

            var event = events[i]; //grabs the event in the event array at location [i]

            //create an event obj for easier storage and manipulation (good practice)
            var eventObj = {
                title: event.title,
                venue: event.venue_name,
                start: event.start_time,
                address: event.venue_address,
                description: event.description,
                eventID: event.id,  //build items on dom
                color: colors[Math.floor(Math.random() * colors.length)],
                attendees: 0
            };

            var newRow = $("<tr>").attr("class", "eventRow").attr("data-event-id", event.eventID); //creates a new row with a class for styling and scripting and a data with the unique ID of the event stored within it
            titleD = $("<td>").text(eventObj.title); //create table data elements with text content
            dateD = $("<td>").text(eventObj.start);
            colorD = $("<td>").text(eventObj.color); //TO DO get this variable from firebase instead
            venueD = $("<td>").text(eventObj.venue);
            attendeesD = $("<td>").text(eventObj.attendees); //TO DO get this variable from firebase instead
            newRow.append(titleD, dateD, colorD, venueD, attendeesD); // appends that text content to the newRow we declared earlier
            $("#results").append(newRow) //appends that newRow (along with its children) to the DOM


            database.ref().push(eventObj);
            // store event in firebase



        }

        //click event for modal (-comment and code right below done by mohammed)
        $(".eventRow").on("click", function(event) {
        //modal activation goes here    
        console.log("This works");
        });

    })
});




let locateUrl = "https://www.googleapis.com/geolocation/v1/geolocate?key=" + locKey //geolocation url

$.ajax({ //geolocation ajax request
    url: locateUrl,
    method: 'POST',
}).then(function (result) {
    console.log(result); //returns latitude and longitude and accuracy
})

    /* just logic i'm saving for later, related to pulling data out of firebase
    
    click function
    snapshot.forEach()
    ref.on("child_added", function(child) {
        console.log(child.key+': '+child.val());
        var tr = document.createElement('tr');
        var td = document.createElement('td');
        td.innerText = child.val().email + " --- " + JSON.stringify(child.val());
        tr.appendChild(td);
        table.appendChild(tr);
    });
    
    
    var eventID = $("somefuckingelementonthepage").attr("data-event-id")
    var newFilteredArray array.filter(function(element){
        return id === eventID;
    });
    
    
    
    getTheChildSnapshots(function(child){
        if(child.id === eventID){
            do something
        }
    })
    */