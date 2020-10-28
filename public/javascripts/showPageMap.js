mapboxgl.accessToken = mapToken;
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11', 
    center: hotel.geometry.coordinates, 
    zoom: 8
});

var marker = new mapboxgl.Marker()
.setLngLat(hotel.geometry.coordinates)
.addTo(map);
