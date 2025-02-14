maptilersdk.config.apiKey = 'm3TWlsf1PQx83R7vBlNH';
const map = new maptilersdk.Map({
    container: 'map', // container's id or the HTML element to render the map
    style: "streets",
    center: [77.04144, 28.62978], // starting position [lng, lat]
    zoom: 14, // starting zoom
});
