//-----------------------------------------------------MeetUp API JS----------------------------------------------------------------------------//
window.onload = function() {

$('#zipHolder').hide();//Hides on window.load
$('#sidebar-wrapper').hide();
$('#meetUpContainer').hide();
$("#wrapper").toggleClass("active");

$("#menu-toggle").click(function(e) {
    $('#sidebar-wrapper').show();
    e.preventDefault();
    $("#wrapper").toggleClass("active");

});
//-----------------------------------------------------MeetUp Variable-------------------------------------------------------------------//

var topic = '';
var zip = '';
var results;
var ApiKey = '1a143e3f55f5e4a64664065683536';
var queryUrl = 'https://api.meetup.com/2/open_events?key=' + ApiKey + '&sign=true&photo-host=public&topic=' + topic + '&zip=' + zip + '&page=5&fields=next_event,time,group_photos&callback=?';
var tryZip = '';

//---------------------------------------------------------------------------------------------------------------------------------//
//-----------------------------------------------------Zip Code/Search logic---------------------------------------------------------//
function isValidUSZip(isZip) { // returns boolean; if user input is valid US zip code
   return /^\d{5}(-\d{4})?$/.test(isZip);
}

$('#zipSearch').on('click', function(event) { //on click of the zip code 'Go!' button 
  event.preventDefault(event);
  tryZip = $('#userZip:text').val();
  $('#searchError').html('')

  if (isValidUSZip(tryZip) === true) { //if Valid zip code set as user zip code.
    zip = tryZip;
    $('#zipHolder').html('Current Zip Code: ' + zip + ' <span class="caret"></span>');
    $('#searchError').html('');
    $('#zipHolder, #zipSearch, #zipForm').toggle();  //toggles either hide/display to these classes
  }
  else {
    $('#zipForm').addClass('has-error'); //if invalid zip, turns the search box red
  }
});

$('#changeZip').on('click', function(event) {
    $('#zipHolder, #zipSearch, #zipForm').toggle();
    $('#userZip:text').val('');
    $('#zipForm').removeClass('has-error');
});

$('#searchButton').on('click', function(event) {
  event.preventDefault(event);


  if ($('#userInput:text').val().trim() !== '' && $("#zipHolder").is(":visible")) { //Prevents searching if there is no input,
    topic = $('#userInput:text').val().trim();                                    //sets topic to user input, makes api call,
    $('#meetUpContainer').show();                                                             //clears search box
    $('#userInput:text').val('');
    if ($('#sidebar-wrapper').is(':visible')) {
      $('#meetUpHolder').empty();
      getMeetUp();     
    }
    else {
      $('#meetUpHolder').empty();
      $('#sidebar-wrapper').show();
      $("#wrapper").toggleClass("active");
      getMeetUp();
    }
  }

  else if ($('#zipHolder').is(':hidden')) {
    $('#searchError').html('Please select a zip code.')
    $('#zipForm').addClass('has-error');
    $('#userInput:text').val('');
  };

});

//---------------------------------------------------------------------------------------------------------------------------------//
//-----------------------------------------------------------MeetUp API Call-------------------------------------------------------//

let getMeetUp = function(){ 
    queryUrl = 'https://api.meetup.com/2/open_events?key=' + ApiKey + '&sign=true&photo-host=public&topic=' + topic + '&zip=' + zip + '&page=5&fields=next_event,time,group_photos&callback=?';
    
    $.getJSON(queryUrl, null, function(data) { //initial API call      
      results = data.results;
        if (data.code === 'badtopic' || results.length === 0) { //if no meetup found based on user search, defaults to javascript meetups
          topic = 'javascript'
          queryUrl = 'https://api.meetup.com/2/open_events?key=' + ApiKey + '&sign=true&photo-host=public&topic=' + topic + '&zip=' + zip + '&page=5&fields=next_event,time,group_photos&callback=?';
      
          $.getJSON(queryUrl, null, function(data){ // Second API call 
            results = data.results;
            $('#noResults').html('We couldnt find any meetups meeting your search criteria. Heres a few others you may be interested in:' + '<br>' + '<br>')
            displayMeetUp();
          })
        }
          else {
            $('#noResults').html('');
            displayMeetUp();
          };
      });

};

let displayMeetUp = function() {   //Displays up meetup on HTML, reformats unix time
    for (var i =0; i < results.length; i ++){
      var meetUpDiv=$('<div>');
      var p =  $('<p>');
      var link = $('<a>');
      var img = $('<img>');
      var time = results[i].time;
      var timeMoment = moment(time, 'x');
      var currentTime = timeMoment.format('LLL')


      img.attr('src', results[i].group.photos[0].highres_link);
      img.css('width', '150px')
      img.css('height', '100px')
      link.attr('href', results[i].event_url)
      link.attr('target', '_blank');
      link.text('RSVP');
      meetUpDiv.addClass('meetUpDiv')
    if (results[i].venue === undefined) {
      p.html("<br>" + results[i].name + '<br>' + "Next Event: " + currentTime);
    }
    else {
      p.html("<br>" + results[i].name + '<br>' + results[i].venue.name + '<br>' + results[i].venue.city + ', ' + results[i].venue.state + '<br>' + "Next Event: " + currentTime);
    }
      meetUpDiv.append(p);
      meetUpDiv.append(img);
      meetUpDiv.append(link);
      $('#sidebar-wrapper').append(meetUpDiv);
  
    }
};
//---------------------------------------------------------------------------------------------------------------------------------//
}; //window On load



