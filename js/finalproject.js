//MAP
function init() {

$('#timeline').hide();

var myresult,selected_size;
var selected_size=240;
var theThing = 'shopping';
var pageNumber = 10

// when the page loads connect the buttons that update the flickr parameters
// to functions that set the variables used in the url http get call
$(document).ready(function(){
  // the size buttons when clicked set the value for how big the images are
  $("#sq").click(function(){
    selected_size=75;
  })
  $("#lg-sq").click(function(){
    selected_size=150;
  })
  $("#thumb").click(function(){
    selected_size=100;
  })
  $("#small").click(function(){
    selected_size=240;
  })
  $("#mid").click(function(){
    selected_size=500;
  })
  $("#ori").click(function(){
    selected_size=640;
  })
  // the topic buttons when clicked set the value for which topics the images are
  $("#dogs").click(function(){
    theThing = 'dogs';
  })
  $("#shopping").click(function(){
    theThing = 'shopping';
  })
  $("#night").click(function(){
    theThing = 'night';
  })
  $("#building").click(function(){
    theThing = 'building';
  })
  $("#food").click(function(){
    theThing = 'food';
  })
  $("#random").click(function(){
    theThing = '';
  })
  // the city buttons when clicked set the view of the map to that of the cities
  // that were clicked
  $("#losangeles").click(function(){
    map.setView([34.04583, -118.26233],13)
  })
  $("#seattle").click(function(){
    map.setView([47.60622, -122.33551],13)
  })
  $("#newyork").click(function(){
    map.setView([40.73165, -73.99086],13)
  })
  $("#sanfrancisco").click(function(){
    map.setView([37.77804, -122.41053],13)
  })
  $("#portland").click(function(){
    map.setView([45.51844, -122.67454],13)
  })
  $("#washingtondc").click(function(){
    map.setView([38.89745, -77.03648],13)
  })
  // takes user input and sets that to be the topic of photos when a location
  // on the map is clicked.
  $("#settopic").click(function(){
    theThing = $('#userinput').val()
  })
  // takes user input and sets that to be the number of photos when a location
  // on the map is clicked.
  $("#pagenumbers").on('change',function(){
    pageNumber = parseInt($(this).val());
  })
});

// L is the leaflet library, here the L is bieng used to makee a new map layer object.
// The view of the map and what basemap is used are set here.
var map = L.map('map').setView([47.60886, -122.34008], 15);
var osmUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png'
var osmLayer = new L.TileLayer(osmUrl, {
    zoomControl: true,
    attributionControl:false,
    minZoom: 2,
    //'maxZoom':8,
    //'worldCopyJump': false
});
map.addLayer(osmLayer)

//PopUp function to show catch lat long
var popup = L.popup();

// this is the call back that will trigger when a location on the map is clicked
function onMapClick(e) {
  popup
    //attach popuo with lat/long info to places clicked on the map
    .setLatLng(e.latlng)
    .setContent(e.latlng.toString())
    .openOn(map);
    // show timeline and empty images from previous search
    $('#timeline').show();
    // empty previous images from results in the timeline
    $("#results").empty();
    // flickr url with to api method flickr.photos.search
    // parameters are set to variable that can be set
    var flickrApiUril = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=3fe4879a5cbb64c72bd1c73499e6c9dd&per_page=" + pageNumber + "&tags=" + theThing + "&tag_mode=any&lon=" + e.latlng.lng + "&lat="+ e.latlng.lat +"&radius=1&format=json&nojsoncallback=1"
    // receive and manages json object flickr api call
    $.getJSON(flickrApiUril,function(json){
      // each photo found there is an api call using the photo id in order to get the
      // image url to be used.
      $.each(json.photos.photo,function(i,myresult){
        image_url = "https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=3fe4879a5cbb64c72bd1c73499e6c9dd&photo_id="+myresult.id+"&format=json&nojsoncallback=1";
        $.getJSON(image_url,function(size){
          // for each image object that is returned add it to the results div in the sidebar
          $.each(size.sizes.size,function(i,myresult_size){
            if(myresult_size.width==selected_size){
            $("#results").append('<h2>' + myresult.title + '<h2/>');
            $("#results").append('<p><a href="'+myresult_size.url+'" target="_blank"><img src="'+myresult_size.source+'"/></a></p>');
            }
          })
        })
      })
    });
}

map.on('click', onMapClick);

// prevent the map underneath from reacting when the images in the sidebar are
// engaged.
$('#results').on('mouseover', function() {
  map.scrollWheelZoom.disable();
  map.off('click')
});
$('#results').on('mouseout', function() {
  map.scrollWheelZoom.enable();
  map.on('click', onMapClick);
});
// on mouseover hide the sidebar
$('#rightarrow').on('mouseover', function() {
  $('#timeline').fadeOut();
});


//basemap layer controls to toggle between satelite and road imagery
var geojson = {}
var baselayers = {
    ESRI : L.esri.basemapLayer('Imagery'),
    OpenStreetMap : L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png')
};
L.control.layers(baselayers,geojson,{position: 'topleft'}).addTo(map);

}

window.onload = init();
