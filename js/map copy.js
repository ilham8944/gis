// PILIH MAP
const cities = L.layerGroup();
const mbAttr =
  'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';
const mbUrl =
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw";
const streets = L.tileLayer(mbUrl, {
  id: "mapbox/streets-v11",
  tileSize: 512,
  zoomOffset: -1,
  attribution: mbAttr,
});
const osm = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
});

// TAMPILKAN MAP
const map = L.map("map").setView([-6.589164, 106.806085], 15);

// LAYERS
const tiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  layers: [osm, cities],
}).addTo(map);
const baseLayers = {
  OpenStreetMap: osm,
  Streets: streets,
};
const overlays = {
  Cities: cities,
};
const layerControl = L.control.layers(baseLayers, overlays).addTo(map);
// const roofParkBogor = L.marker([
//   -6.589213093496007, 106.80513618437153,
// ]).bindPopup("Sekolah Vokasi");
// const Hugo = L.marker([-6.591282, 106.808047]).bindPopup("Hugo Caffe");
// const kopiKenalan = L.marker([
//   -6.591026411590844, 106.80639193145856,
// ]).bindPopup("Hugo Caffe");
// const caffe = L.layerGroup([roofParkBogor, Hugo, kopiKenalan]);
const satellite = L.tileLayer(mbUrl, {
  id: "mapbox/satellite-v9",
  tileSize: 512,
  zoomOffset: -1,
  attribution: mbAttr,
});
layerControl.addBaseLayer(satellite, "Satellite");

// layerControl.addOverlay(caffe, "Caffe");

// CURENT LOCATION
navigator.geolocation.getCurrentPosition(function (location) {
  var latlng = new L.LatLng(
    location.coords.latitude,
    location.coords.longitude
  );
  currentLocation = latlng;
  titik = L.marker(latlng).addTo(map);

  // ROUTING
  var jalur1 = L.Routing.control({
    waypoints: [L.latLng(currentLocation), L.latLng(-6.591282, 106.808047)],
    routeWhileDragging: true,
  }).addTo(map);

  var jalur2 = L.Routing.control({
    waypoints: [
      L.latLng(currentLocation),
      L.latLng(-6.588683800646825, 106.80468894688998),
    ],
    lineOptions: {
      styles: [{ color: "yellow", opacity: 1, weight: 5 }],
    },
    routeWhileDragging: true,
  }).addTo(map);

  var jalur3 = L.Routing.control({
    waypoints: [
      L.latLng(currentLocation),
      L.latLng(-6.594836698554471, 106.80578898800908),
    ],
    lineOptions: {
      styles: [{ color: "blue", opacity: 1, weight: 5 }],
    },
    routeWhileDragging: true,
  }).addTo(map);

  var jalur4 = L.Routing.control({
    waypoints: [L.latLng(currentLocation), L.latLng(-6.600719, 106.809154)],
    lineOptions: {
      styles: [{ color: "green", opacity: 1, weight: 5 }],
    },
    routeWhileDragging: true,
  }).addTo(map);

  var jalur5 = L.Routing.control({
    waypoints: [
      L.latLng(currentLocation),
      L.latLng(-6.588905455582773, 106.80515321644408),
    ],
    lineOptions: {
      styles: [{ color: "purple", opacity: 1, weight: 5 }],
    },
    routeWhileDragging: true,
  }).addTo(map);
});

// POLYGON
var latlngs = [
  [-6.578072, 106.784824],
  [-6.579222, 106.821753],
  [-6.613254, 106.821842],
  [-6.611221, 106.785269],
];

var polygon = L.polygon(latlngs, { color: "red" }).addTo(map);

// zoom the map to the polygon
map.fitBounds(polygon.getBounds());
