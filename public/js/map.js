maptilersdk.config.apiKey = 'm3TWlsf1PQx83R7vBlNH';

// Ensure coordinates are properly formatted
console.log("Coordinates received:", coordinates);
console.log("Type of coordinates:", typeof coordinates);

let formattedCoordinates;

// Check if coordinates is a string and try to parse it
if (typeof coordinates === "string") {
    try {
        formattedCoordinates = JSON.parse(coordinates);
        console.log("Parsed coordinates:", formattedCoordinates);
    } catch (error) {
        console.error("Failed to parse coordinates:", error);
    }
}

if (Array.isArray(formattedCoordinates) && formattedCoordinates.length === 2) {

    const map = new maptilersdk.Map({
        container: 'map',
        style: "streets",
        center: formattedCoordinates,
        zoom: 14,
    });

    new maptilersdk.Marker({ color: 'red' })
        .setLngLat(formattedCoordinates)
        .setPopup(
            new maptilersdk.Popup()
                .setHTML(`<h4>${locTitle}</h4><p>The exact location of the listing</p>`)
        )
        .addTo(map);

} else {
    console.error("Invalid coordinates format:", formattedCoordinates);
}
