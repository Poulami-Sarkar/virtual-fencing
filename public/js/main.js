// This example requires the Drawing library. Include the libraries=drawing
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=drawing">

var map;
var home = {lat: 12.8864, lng: 77.5900};
var lt;
var ln;
var intlat;
var intlng;
var marklat;
var marklng
var markers = [];
var forbidden =[];
var restrcited =[];
var safe = []
var theta = 0
var start = 0
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
        if (!lt)
            markers[0].setCenter(home)
        else
        markers[0].setCenter({lat: parseFloat(lt), lng: parseFloat(ln)});
        console.log("coords: ",lt,ln)
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
var overlay;

USGSOverlay.prototype = new google.maps.OverlayView();

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
        home = {lat: intlat, lng: intlng}
        var mark = new google.maps.Marker({
            position: home,
            map: map,
            title: 'Lat:'+intlat.toString()+' Lng: '+intlng.toString()
        });
        map.setCenter(home);
    });

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
      
     

      var bounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(12.887903323706196 -77.59094404790812),
        new google.maps.LatLng(12.887585644789938 ,-77.59059133742267)
        );

    // The photograph is courtesy of the U.S. Geological Survey.
    var srcImage = 'data:image/jpeg;base64,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';
    //srcImage += 'examples/full/images/talkeetna.png';

    overlay = new USGSOverlay(bounds, srcImage, map); 
}


/** @constructor */
function USGSOverlay(bounds, image, map) {

    // Now initialize all properties.
    this.bounds_ = bounds;
    this.image_ = image;
    this.map_ = map;

    // Define a property to hold the image's div. We'll
    // actually create this div upon receipt of the onAdd()
    // method so we'll leave it null for now.
    this.div_ = null;

    // Explicitly call setMap on this overlay
    this.setMap(map);
  }

  /**
   * onAdd is called when the map's panes are ready and the overlay has been
   * added to the map.
   */
  USGSOverlay.prototype.onAdd = function() {

    var div = document.createElement('div');
    div.style.border = 'none';
    div.style.borderWidth = '0px';
    div.style.position = 'absolute';

    // Create the img element and attach it to the div.
    var img = document.createElement('img');
    img.src = this.image_;
    img.style.width = '100%';
    img.style.height = '100%';
    div.appendChild(img);

    this.div_ = div;

    // Add the element to the "overlayImage" pane.
    var panes = this.getPanes();
    panes.overlayImage.appendChild(this.div_);
  };

  USGSOverlay.prototype.draw = function() {

    // We use the south-west and north-east
    // coordinates of the overlay to peg it to the correct position and size.
    // To do this, we need to retrieve the projection from the overlay.
    var overlayProjection = this.getProjection();

    // Retrieve the south-west and north-east coordinates of this overlay
    // in LatLngs and convert them to pixel coordinates.
    // We'll use these coordinates to resize the div.
    var sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
    var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());

    // Resize the image's div to fit the indicated dimensions.
    var div = this.div_;
    div.style.left = sw.x + 'px';
    div.style.top = ne.y + 'px';
    div.style.width = (ne.x - sw.x) + 'px';
    div.style.height = (sw.y - ne.y) + 'px';
  };

  USGSOverlay.prototype.onRemove = function() {
    this.div_.parentNode.removeChild(this.div_);
  };

  // Set the visibility to 'hidden' or 'visible'.
  USGSOverlay.prototype.hide = function() {
    if (this.div_) {
      // The visibility property must be a string enclosed in quotes.
      this.div_.style.visibility = 'hidden';
    }
  };

  USGSOverlay.prototype.show = function() {
    if (this.div_) {
      this.div_.style.visibility = 'visible';
    }
  };

  USGSOverlay.prototype.toggle = function() {
    if (this.div_) {
      if (this.div_.style.visibility === 'hidden') {
        this.show();
      } else {
        this.hide();
      }
    }
  };

  // Detach the map from the DOM via toggleDOM().
  // Note that if we later reattach the map, it will be visible again,
  // because the containing <div> is recreated in the overlay's onAdd() method.
  USGSOverlay.prototype.toggleDOM = function() {
    if (this.getMap()) {
      // Note: setMap(null) calls OverlayView.onRemove()
      this.setMap(null);
    } else {
      this.setMap(this.map_);
    }
  };


  google.maps.event.addDomListener(window, 'load', initMap);



