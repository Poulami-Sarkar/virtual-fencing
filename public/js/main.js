// All query Parameters
const urlParams = new URLSearchParams(window.location.search);
const email = urlParams.get('email');
const phoneno = urlParams.get('no');
// This example requires the Drawing library. Include the libraries=drawing
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=drawing">

var map;                                            // Map Variable
var home = {lat: 12.8864, lng: 77.5900};            // Starting users location
var lt;                                             // Lat position obtained from the form
var ln;                                             // Lng position obtained from the form
var marklat;                                        // Controls the lat of the red dot
var marklng                                         // Controls the lat of the red dot
var res=false;                                      // True or false res of the red dot
var mark;                                           // Marker to indicate the user's position
var other_bounds=[];                                // Bounds sent from the whatsapp SMS
var markers = [];                                   // The red dot
var forbidden =[];                                  
var restrcited =[];
var safe = []
var theta = 0                                       // Controls the motion of the dot 
var start = 0                                       // Start moving the dot

/*
// Sending Get requests for response
*/

// Alter message
function send_alter (str){
    var http = new XMLHttpRequest();
    var url = '/data?&no='+phoneno+'&msg='+str+'&email='+email;
    http.open('GET', url, true);
    
    //Send the proper header information along with the request
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    
    http.onreadystatechange = function() {//Call a function when the state changes.
        if(http.readyState == 4 && http.status == 200) {
            //alert(http.responseText);
            result=http.responseText;
        }
    }
    console.log("query returning");
    http.send()   ;  
}

//Get bounds
function get_bounds(){
    var http = new XMLHttpRequest();
    var url = '/bounds';
    http.open('GET', url, true);
    
    //Send the proper header information along with the request
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    
    http.onreadystatechange = function() {//Call a function when the state changes.
        if(http.readyState == 4 && http.status == 200) {
            //alert(http.responseText);
            other_bounds=JSON.parse(http.responseText);
        }
    }
    http.send();     
}


// Get latitude
$("#lat").change(function(){
    lt = $("#lat").val()
});
// Get longitude
$("#lng").change(function(){
    ln = $("#lng").val()
});

function contains_loc(e){
    var bounds = get_bounds();
    console.log(other_bounds)
    var tempres = false;
    if (forbidden.length !=0){        
        tempres = google.maps.geometry.poly.containsLocation(markers[0].getCenter(), forbidden[0]);
    }
    if (tempres == false){
        for(i =0;i<other_bounds.length;i++){
            var poly = new google.maps.Polygon({paths: JSON.parse(other_bounds[i]),
                fillColor: '#FF0000'
            });
            tempres = google.maps.geometry.poly.containsLocation(markers[0].getCenter(), poly);
            console.log(tempres);
        }
    }  
    
    if (restrcited.length !=0)
        tempres = google.maps.geometry.poly.containsLocation(markers[0].getCenter(), restrcited[0]);   
    
    if (res != tempres){
        send_alter(tempres)
    }    
    res = tempres;
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
            if (!lt)
                markers[0].setCenter(home)
            else{
                markers[0].setCenter({lat: parseFloat(lt), lng: parseFloat(ln)});
                console.log("coords: ",lt,ln)
            }   
        });
    });

}        
/**
 * Controls the Dot
 */

function movedot(){     
    theta+=1
    markers[0].setCenter({lat: 0.002*Math.cos(3.14*theta/180)+marklat, lng: 0.0005*Math.sin(3.14*theta/180)+marklng});
    
    console.log(0.002*Math.cos(theta)+marklat,0.0005*Math.sin(theta)+marklng);
 
}

function DotControl(dotControlDiv, map){
    var controlUI = create_button(dotControlDiv,"Start", "Click to Start the simulation");

    // Setup the click event listeners: simply set the map to Chicago.
    controlUI.addEventListener('click', function() {
        marklat = markers[0].getCenter().lat()-0.002*Math.cos(3.14*0/180);
        marklng = markers[0].getCenter().lng()-0.0005*Math.sin(3.14*0/180);
        theta=0;
        console.log('Start',marklat,marklng);
        var interval = setInterval(movedot, 500);
        setTimeout(function(){ clearInterval(interval) }, 5000);
        console.log(start)
    });
}

/**
 * Initialize the application.
 * Automatically called by the google maps API once it's loaded.
*/
//var overlay;

//USGSOverlay.prototype = new google.maps.OverlayView();

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
        var intlat = parseFloat(position.coords.latitude);
        var intlng = parseFloat(position.coords.longitude);
        console.log(intlat,intlng);
        home = {lat: intlat, lng: intlng}
        mark = new google.maps.Marker({
            position: home,
            map: map,
            title: 'Lat:'+intlat.toString()+' Lng: '+intlng.toString()
        });
        map.setCenter(home);
    });

    // Grack user
    trackMe();

    // The red dot 
    for (i=0;i<1;i++){
        x = new google.maps.Circle({
            map: map,
            center: home,
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
        google.maps.event.addListener(markers[i],'center_changed',contains_loc);
        console.log(markers[0].getCenter().lat());
        //console.log('Radius '+markers[0);
    }

    // Create the DIV to hold the control and call the CenterControl()
    // constructor passing in this DIV.
    var centerControlDiv = document.createElement('div');
    var centerControl = new CenterControl(centerControlDiv, map);

    centerControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);

    // Add toggle button for Starting and stopping the simulation
    var dotControlDiv = document.createElement('div');
    var dotControl = new DotControl(dotControlDiv, map);
    dotControlDiv.index = 2;
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(dotControlDiv);

    google.maps.event.addListener(drawingManager, 'polygoncomplete', function(poly) {
        var path = new google.maps.Polygon({paths: poly.getPath()});
        forbidden.push(path);
        //console.log(path);
      });
    google.maps.event.addListener(drawingManager, 'markercomplete', function(marker) {
        console.log( marker.getPosition().lat(),marker.getPosition().lng());
        //console.log(path);
      });
      
}

/*
* Function to track user position
*/

function trackMe() {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition((position) => {
        showTrackingPosition(position);
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
}

function showTrackingPosition(position) {
    console.log(`tracking postion:  ${position.coords.latitude} - ${position.coords.longitude}`);
    this.currentLat = position.coords.latitude;
    this.currentLong = position.coords.longitude;

    let location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    //this.map.panTo(location);

    mark.setPosition(location);
    contains_user(location);
    mark.setTitle(position.coords.latitude.toString()+' '+position.coords.longitude.toString());
  }

function contains_user(location){
    var bounds = get_bounds();
    console.log(other_bounds)
    var tempres = false;
    if (forbidden.length !=0){        
        tempres = google.maps.geometry.poly.containsLocation(location, forbidden[0]);
    }
    for(i =0;i<other_bounds.length;i++){
        var poly = new google.maps.Polygon({paths: JSON.parse(other_bounds[i]),
            fillColor: '#FF0000'
        });
        if (tempres == true)
            break;
        tempres = google.maps.geometry.poly.containsLocation(location, poly);
        console.log(tempres);
    }
    if (restrcited.length !=0)
        tempres = google.maps.geometry.poly.containsLocation(location, restrcited[0]);   
    
    if (res != tempres){
        send_alter(tempres)
    }    
    res = tempres;
}
//google.maps.event.addDomListener(window, 'load', initMap);



