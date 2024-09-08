document.addEventListener('DOMContentLoaded', () => {
  const map = L.map('map');

  // Tambahkan layer dasar
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  // Koordinat bounding box Indonesia
  const bounds = [
    [-11.5, 95.0], // South-West Corner
    [6.5, 141.0]   // North-East Corner
  ];

  // Atur tampilan awal peta untuk mencakup seluruh wilayah Indonesia
  map.fitBounds(bounds);

  const provinces = {};
  let allFeatures = [];

  fetch('js/sebaran_peta_banjir.json')
    .then(response => response.json())
    .then(data => {
      if (data.type !== 'FeatureCollection' || !Array.isArray(data.features)) {
        throw new Error('Invalid data format');
      }

      // Kelompokkan data berdasarkan provinsi dan simpan semua fitur
      data.features.forEach(feature => {
        if (feature.geometry && feature.geometry.type === 'Point' && feature.geometry.coordinates) {
          const prov = feature.properties.provinsi;
          if (!provinces[prov]) {
            provinces[prov] = [];
          }
          provinces[prov].push(feature);
          allFeatures.push(feature); // Simpan semua fitur
        } else {
          console.warn('Feature missing geometry or coordinates', feature);
        }
      });

      // Tampilkan daftar provinsi dengan jumlah fitur
      const provList = document.getElementById('province-list');
      if (!provList) {
        throw new Error('Element with ID province-list not found');
      }

      const showAll = document.getElementById('show-all');
      showAll.addEventListener('click', () => showFeatures('all', showAll));

      Object.keys(provinces).forEach(prov => {
        const count = provinces[prov].length;
        const item = document.createElement('li');
        item.className = 'list-group-item';
        item.textContent = `${prov} (${count})`;
        item.dataset.provinsi = prov; // Store provinsi in data attribute
        item.addEventListener('click', () => showFeatures(prov, item));
        provList.appendChild(item);
      });

      // Update summary
      updateSummary('');
    })
    .catch(error => console.error('Error fetching JSON data:', error));

  function showFeatures(prov, element) {
    // Hapus marker sebelumnya dari peta
    if (window.currentMarkers) {
      window.currentMarkers.clearLayers();
    }

    // Hapus highlight dari item sebelumnya
    document.querySelectorAll('#province-list .list-group-item').forEach(item => item.classList.remove('active'));
    element.classList.add('active');

    let featuresToShow;

    if (prov === 'all') {
      featuresToShow = allFeatures;
      updateSummary('Semua Data');
    } else {
      featuresToShow = provinces[prov];
      updateSummary(prov);
    }

    // Tambahkan marker untuk fitur yang akan ditampilkan
    const markers = featuresToShow.map(feature => {
      const coords = feature.geometry.coordinates;
      return L.marker([coords[1], coords[0]])
        .bindPopup(`<b>${feature.properties.nama_infrastruktur}</b><br>${feature.properties.kota_kabupaten}`)
        .on('click', () => {
          map.setView([coords[1], coords[0]], 15);
        });
    });

    // Simpan marker ke window.currentMarkers sebagai L.layerGroup
    window.currentMarkers = L.layerGroup(markers).addTo(map);

    // Periksa apakah window.currentMarkers adalah L.layerGroup
    if (window.currentMarkers.getBounds) {
      map.fitBounds(window.currentMarkers.getBounds()); // Adjust map view to fit markers
    } else {
      console.warn('window.currentMarkers does not have getBounds method');
    }
  }

  function updateSummary(prov) {
    const summary = document.getElementById('province-summary');
    if (!summary) {
      throw new Error('Element with ID province-summary not found');
    }

    if (prov) {
      const count = (prov === 'Semua Data') ? allFeatures.length : provinces[prov].length;
      summary.innerHTML = `<strong>${prov}</strong> memiliki <span class="badge bg-primary">${count}</span> data banjir.`;
    } else {
      summary.innerHTML = `<p class="text-muted">Pilih provinsi atau tampilkan semua data.</p>`;
    }
  }
});
