var name = "Music Festival";
var date = "June/20/2018"
var attendees = "250"



$("#submit").on("click", function(event){
    
    var locationInput = $("#eventLocationQuery").val().trim();
    console.log(locationInput);    

$("#results").append(`<tr><td>${name}</td><td>${date}</td><td>${attendees}</td></tr>`)

    
});