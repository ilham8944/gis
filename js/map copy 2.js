// Inisialisasi peta
const map = L.map('map').setView([-7.47485, 112.44191], 10); // Set to an initial view

// Tambahkan layer dasar
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Kelompokkan data berdasarkan provinsi
const provinces = {};

fetch('js/sebaran_peta_banjir.json')
  .then(response => response.json())
  .then(data => {
    if (data.type !== 'FeatureCollection' || !Array.isArray(data.features)) {
      throw new Error('Invalid data format');
    }

    data.features.forEach(feature => {
      // Pastikan feature memiliki property 'geometry' dan 'coordinates'
      if (feature.geometry && feature.geometry.type === 'Point' && feature.geometry.coordinates) {
        const prov = feature.properties.provinsi;
        if (!provinces[prov]) {
          provinces[prov] = [];
        }
        provinces[prov].push(feature);
      } else {
        console.warn('Feature missing geometry or coordinates', feature);
      }
    });

    // Tambahkan layer marker untuk setiap provinsi
    Object.keys(provinces).forEach(prov => {
      const markers = provinces[prov].map(feature => {
        const coords = feature.geometry.coordinates;
        return L.marker([coords[1], coords[0]])
          .bindPopup(`<b>${feature.properties.nama_infrastruktur}</b><br>${feature.properties.kota_kabupaten}`)
          .on('click', () => {
            map.setView([coords[1], coords[0]], 15);
          });
      });

      const group = L.layerGroup(markers).addTo(map);
      L.control.layers(null, { [prov]: group }).addTo(map);
    });
  })
  .catch(error => console.error('Error fetching JSON data:', error));
