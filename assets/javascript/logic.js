

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

  var database = firebase.database()



let eventUrl = "http://api.eventful.com/json/events/search"
const locKey = "AIzaSyAS7eVhjgd7vDmyAMGzCzygJ2q1sf1kXKo"
let locateUrl = "https://www.googleapis.com/geolocation/v1/geolocate?key=" + locKey
const eventkey = "WVV7pQ6XZXdVrR9r"
let locale = "houston"
// places key AIzaSyA-pk1lPpQAEyQizOfLuubSMC_fyLwy-DM

eventUrl += '?' + $.param({
    'app_key': eventkey,
    'location': "houston" //mapUrl.location,

})

// mapUrl += '?' + $.param({
//     'app_key': eventkey,
//     'location': locale,
// })

$.ajax({
    url: eventUrl,
    method: 'GET',
    dataType: 'jsonp'
}).then(function (result) {
    console.log(result);
    var events = result.events.event;
    console.log (events)

    for (i = 0; i < events.length; i++) {
        var event = events[i]
        var title = event.title ;
        var venue = event.venue_name ;
        var start = event.start_time ;
        var address = event.venue_address;
        var description = event.description;
        var eventID = event.id;  //build items on dom
       
       database.ref().push({
           id: eventID,
           title : title,
           venue : venue,
           startTime : start,
           address : address,
           description : description,
           attendance : 0,
       })

 //store event in firebase
    }
})

/*

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

$.ajax({
    url: locateUrl,
    method: 'POST',
}).then(function (result) {
    console.log(result);
})
//

var name = "Music Festival";
var date = "June/20/2018"
var attendees = "250"



$("#submit").on("click", function(event){
    
    var locationInput = $("#eventLocationQuery").val().trim();
    console.log(locationInput);    

$("#results").append(`<tr><td>${name}</td><td>${date}</td><td>${attendees}</td></tr>`)

    
});

