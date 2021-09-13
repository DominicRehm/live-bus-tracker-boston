// Mapboxgl Accesstoken
mapboxgl.accessToken = '';

// Markers array
var busMarkers = [];
var url = `https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip`;

// Mapboxgl map
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-71.104081, 42.365554],
    zoom: 13,
});

// Fetch function to receive the bus data
async function getBusLocations() {
    const response = await fetch(url);
    const json = await response.json();
    return json.data;
};

// Function that creates the bus markers
async function createBusMarker() {
    const locations = await getBusLocations();

    // Loop through each item in locations
    locations.forEach((bus) => {

        // Create custom bus marker
        const busMarker = document.createElement('div');
        busMarker.classList = 'busMarker';

        // Show bus markers
        var marker = new mapboxgl.Marker({ element: busMarker })
            .setLngLat([bus.attributes.longitude, bus.attributes.latitude])
            .addTo(map)
        // add marker to the busMarkers array
        busMarkers.push(marker);
    });
};

// Function that delets the old markers
function resetMarkers() {
    busMarkers.forEach((bus) => {
        bus.remove();
    });
}

// Function to start the whole progress
async function startMapAnimation() {
    resetMarkers();
    await createBusMarker();

    var progressIntervall = setInterval(fillProgressBar, 1000)

    setTimeout(() => {
        clearInterval(progressIntervall)
        startMapAnimation();
    }, 10000);
};

// Change style with the checkboxes
const layerList = document.querySelector('#menu');
const inputs = layerList.getElementsByTagName('input');

for (const input of inputs) {
    input.onclick = (layer) => {
        const layerId = layer.target.id;
        map.setStyle('mapbox://styles/mapbox/' + layerId);
    }
}

// Change Route with the radio buttons
const routeList = document.querySelector('#routes');
const routeInputs = routeList.getElementsByTagName('input')

for (const routeInput of routeInputs) {
    routeInput.onclick = () => {
        const routeId = routeInput.id;
        url = `https://api-v3.mbta.com/vehicles?filter[route]=${routeId}&include=trip`
    }
}

// Invoke the function for the first time
startMapAnimation();

var width = 0;


// Progressbar for refresh data
function fillProgressBar() {
    const progressBar = document.querySelector('#progressBar');

    if (width >= 405) {
        width = 0;
        progressBar.style.width = `0px`;
        progressBar.style.display = 'none';
    } else {
        width = width + 45;
        progressBar.style.width = `${width}px`;
        progressBar.style.display = 'block';
    };
};