// This example requires the Drawing library. Include the libraries=drawing
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=drawing">

var map;
var home = {lat: 12.8864, lng: 77.5900};
var lt;
var ln;
var intlat;
var intlng;
var markers = [];
var forbidden =[];
var restrcited =[];
var safe = []
var blueCoords = [
    {lat: 25.774, lng: -60.190},
    {lat: 18.466, lng: -46.118},
    {lat: 32.321, lng: -44.757}
];

var redCoords = [
    {lat: 25.774, lng: -80.190},
    {lat: 18.466, lng: -66.118},
    {lat: 32.321, lng: -64.757}
];




// Get latitude
$("#lat").change(function(){
    lt = $("#lat").val()
});
// Get longitude
$("#lng").change(function(){
    ln = $("#lng").val()
});

function contains_loc(e){
    if (forbidden.length !=0)
        var res = google.maps.geometry.poly.containsLocation(markers[0].getCenter(), forbidden[0]);
    if (restrcited.length !=0)
        var res = google.maps.geometry.poly.containsLocation(markers[0].getCenter(), restrcited[0]);   
    if (res == true)
        console.log(res);
}

/**
 * Adds a button to the map
 * Takes argument : Text on button
 * Returns custom UI control button
 */

function create_button(controlDiv,name,title){
    // Set CSS for the control border.
    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.border = '2px solid #fff';
    controlUI.style.borderRadius = '3px';
    controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginBottom = '22px';
    controlUI.style.textAlign = 'center';
    controlUI.title = title;
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior.
    var controlText = document.createElement('div');
    controlText.style.color = 'rgb(25,25,25)';
    controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText.style.fontSize = '16px';
    controlText.style.lineHeight = '38px';
    controlText.style.paddingLeft = '5px';
    controlText.style.paddingRight = '5px';
    controlText.innerHTML = name;
    controlUI.appendChild(controlText);
    return controlUI;
}


/**
 * The CenterControl adds a control to the map that recenters the map on
 * center.
 * This constructor takes the control DIV as an argument.
 * @constructor
 */
function CenterControl(controlDiv, map) {

    // Set CSS for the control border.
    var controlUI = create_button(controlDiv,"Center Map", "Click to recenter the map");

    // Setup the click event listeners: simply set the map to Chicago.
    controlUI.addEventListener('click', function() {
        $("#dialog").dialog("open");
        $("#dialog").on('dialogclose', function(event) {
        //map.setCenter(chicago);
        map.setCenter({lat: parseFloat(lt), lng: parseFloat(ln)});
        console.log("coords: ",lt,ln)
        });
    });

}        


/**
 * Initialize the application.
 * Automatically called by the google maps API once it's loaded.
*/

function initMap() {
    // Initialize  map
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 12.8864, lng: 77.5900},
        zoom: 18
    });

    var drawingManager = new google.maps.drawing.DrawingManager({
        //drawingMode: google.maps.drawing.OverlayType.MARKER,
        drawingControl: true,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: ['polygon','rectangle','marker']
            //drawingModes: ['marker', 'circle', 'polygon', 'polyline', 'rectangle']
        },
        //markerOptions: {icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'},
        circleOptions: {
            fillColor: '#ffff00',
            fillOpacity: 1,
            strokeWeight: 5,
            clickable: false,
            editable: true,
            zIndex: 1
        }
    });
    var drawingManager2 = new google.maps.drawing.DrawingManager({
        //drawingMode: google.maps.drawing.OverlayType.MARKER,
        drawingControl: true,
        drawingControlOptions: {
            position: google.maps.ControlPosition.LEFT_CENTER,
            drawingModes: ['polygon','polygon','polygon']
            //drawingModes: ['marker', 'circle', 'polygon', 'polyline', 'rectangle']
        },
        circleOptions: {

        }
    });
    drawingManager2.setMap(map);
    drawingManager.setMap(map);

    // Get inital users position 
    
    navigator.geolocation.getCurrentPosition(function(position) {
        // Get the coordinates of the current possition.
        intlat = parseFloat(position.coords.latitude);
        intlng = parseFloat(position.coords.longitude);
        console.log(intlat,intlng);
        var mark = new google.maps.Marker({
            position: {lat: intlat, lng: intlng},
            map: map,
            title: 'Hello World!'
        });
    });

    // The red dot 
    for (i=0;i<1;i++){
        x = new google.maps.Circle({
            map: map,
            center: {lat: 12.8864, lng: 77.5900},
            radius:2,
            //paths: redCoords,
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            draggable: true,
            geodesic: true
        });
        markers.push(x);
        google.maps.event.addListener(markers[i],'drag',contains_loc);
        console.log(markers[0].getCenter().lat());
        //console.log('Radius '+markers[0);
    }

    

    // Create the DIV to hold the control and call the CenterControl()
    // constructor passing in this DIV.
    var centerControlDiv = document.createElement('div');
    var centerControl = new CenterControl(centerControlDiv, map);

    centerControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);

    google.maps.event.addListener(drawingManager, 'polygoncomplete', function(poly) {
        var path = new google.maps.Polygon({paths: poly.getPath()});
        forbidden.push(path);
        //console.log(path);
      });
}


