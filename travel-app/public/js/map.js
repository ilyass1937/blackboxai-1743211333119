class TravelMap {
  constructor(containerId, options = {}) {
    this.map = null;
    this.markers = [];
    this.infoWindows = [];
    this.defaultCenter = options.center || { lat: 24.7136, lng: 46.6753 };
    this.defaultZoom = options.zoom || 12;
    this.containerId = containerId;
    this.initMap();
  }

  initMap() {
    const mapElement = document.getElementById(this.containerId);
    if (!mapElement) return;

    this.map = new google.maps.Map(mapElement, {
      center: this.defaultCenter,
      zoom: this.defaultZoom,
      styles: [
        {
          featureType: "poi",
          stylers: [{ visibility: "off" }]
        }
      ]
    });

    // Add search box if enabled
    if (this.options.searchBox) {
      this.addSearchBox();
    }
  }

  addMarker(location, content, icon = null) {
    const marker = new google.maps.Marker({
      position: location,
      map: this.map,
      icon: icon
    });

    const infoWindow = new google.maps.InfoWindow({
      content: content
    });

    marker.addListener('click', () => {
      // Close all other info windows
      this.infoWindows.forEach(iw => iw.close());
      infoWindow.open(this.map, marker);
    });

    this.markers.push(marker);
    this.infoWindows.push(infoWindow);
    return marker;
  }

  addSearchBox() {
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Search places...';
    input.className = 'form-control mb-3';

    const searchBox = new google.maps.places.SearchBox(input);
    this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);

    searchBox.addListener('places_changed', () => {
      const places = searchBox.getPlaces();
      if (places.length === 0) return;

      // Clear existing markers
      this.clearMarkers();

      // For each place, add a marker
      const bounds = new google.maps.LatLngBounds();
      places.forEach(place => {
        if (!place.geometry) return;
        
        const marker = this.addMarker(
          place.geometry.location,
          `<div><h5>${place.name}</h5><p>${place.formatted_address}</p></div>`
        );

        if (place.geometry.viewport) {
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      this.map.fitBounds(bounds);
    });
  }

  clearMarkers() {
    this.markers.forEach(marker => marker.setMap(null));
    this.markers = [];
    this.infoWindows = [];
  }

  setCenter(location) {
    if (this.map && location) {
      this.map.panTo(location);
    }
  }

  addCityMarkers(cities) {
    cities.forEach(city => {
      if (city.location && city.location.lat && city.location.lng) {
        this.addMarker(
          city.location,
          `<div class="map-info-window">
            <h5>${city.name}, ${city.country}</h5>
            <p>${city.description.substring(0, 100)}...</p>
            <a href="/city/${city._id}" class="btn btn-sm btn-primary">Explore</a>
          </div>`,
          'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
        );
      }
    });
  }
}

// Initialize map when Google Maps API is loaded
function initMap() {
  window.travelMap = new TravelMap('map-container', {
    center: { lat: 24.7136, lng: 46.6753 },
    zoom: 8,
    searchBox: true
  });

  // Load cities and add markers
  fetch('/api/cities')
    .then(response => response.json())
    .then(cities => {
      window.travelMap.addCityMarkers(cities);
    })
    .catch(error => {
      console.error('Error loading cities:', error);
    });
}