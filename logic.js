


function displayMeetUp() {
var topic = 'javascript';
var zip = '85254';
var ApiKey = '1a143e3f55f5e4a64664065683536';
var queryUrl = 'https://cfe-meetup-api.herokuapp.com/groups?key=' + ApiKey + '&sign=true&photo-host=public&topic=' + topic + '&zip=' + zip + '&page=3';
  $.ajax({
    
    url: queryUrl,
    method: 'GET'
  }).done(function(response) {
    console.log(response);
  });

};
displayMeetUp();