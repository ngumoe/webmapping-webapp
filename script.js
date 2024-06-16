// Initialize the map and set its view to a chosen geographical coordinates and zoom level
var map = L.map('map').setView([51.505, -0.09], 13);

// Load and display tile layers on the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Add geocoder control to the map
var geocoder = L.Control.geocoder({
    defaultMarkGeocode: false
}).on('markgeocode', function(e) {
    var bbox = e.geocode.bbox;
    var poly = L.polygon([
        bbox.getSouthEast(),
        bbox.getNorthEast(),
        bbox.getNorthWest(),
        bbox.getSouthWest()
    ]).addTo(map);
    map.fitBounds(poly.getBounds());
}).addTo(map);

// Routing control for showing paths/roads
var routingControl = L.Routing.control({
    waypoints: [],
    routeWhileDragging: true,
    geocoder: L.Control.Geocoder.nominatim()
}).addTo(map);

// Function to find and mark user's current location
map.locate({setView: true, maxZoom: 16});
function onLocationFound(e) {
    var radius = e.accuracy / 2;
    L.marker(e.latlng).addTo(map)
        .bindPopup("You are within " + radius + " meters from this point").openPopup();
    L.circle(e.latlng, radius).addTo(map);
}
map.on('locationfound', onLocationFound);

// Function to handle location errors
function onLocationError(e) {
    alert(e.message);
}
map.on('locationerror', onLocationError);

// Add click event to set destination and calculate route
map.on('click', function(e) {
    if (routingControl.getWaypoints().length === 1) {
        routingControl.spliceWaypoints(routingControl.getWaypoints().length - 1, 1, e.latlng);
    } else {
        routingControl.spliceWaypoints(routingControl.getWaypoints().length, 0, e.latlng);
    }
});

// Function to recommend nearby utilities (mocked with random points for simplicity)
function recommendUtilities(lat, lng) {
    var utilities = [
        {name: 'Restaurant', lat: lat + 0.01, lng: lng + 0.01},
        {name: 'Hospital', lat: lat - 0.01, lng: lng - 0.01},
        {name: 'School', lat: lat + 0.02, lng: lng + 0.02}
    ];
    utilities.forEach(function(util) {
        L.marker([util.lat, util.lng]).addTo(map)
            .bindPopup(util.name).openPopup();
    });
}

// Example of recommending utilities near a specific location
recommendUtilities(51.505, -0.09);
