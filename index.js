const express = require('express');

const geoDaeData = require('./fixtures/geodae-pretty.json');

const port = 3000;
const app = express();

app.use(express.static('public'));


// app.get('/', (request, response) => {
//     response.json({
//         name: "Défibrilateur API - Codiscovery",
//         version: '0.0.1'
//     });
// });


const isCoordinatesClose = (
    coords1,
    coords2,
    maxDistance = 2
) => {
    const distance = calcCrow(coords1.lat, coords1.lon, coords2.lat, coords2.lon);
    // console.log('distance', distance);
    return distance <= maxDistance;
};

const  calcCrow = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // km
  const dLat = toRad(lat2-lat1);
  const dLon = toRad(lon2-lon1);
  lat1 = toRad(lat1);
  lat2 = toRad(lat2);

  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const d = R * c;
  return d;
}

// Converts numeric degrees to radians
const toRad = (value) => {
    return value * Math.PI / 180;
}

const allPoints = geoDaeData.features.map((feature) => {
    const address = `${feature.properties.c_adr_num}, ${feature.properties.c_adr_voie} ${feature.properties.c_com_cp} ${feature.properties.c_com_nom}`;
    return {
        name: feature.properties.c_nom,
        lat: feature.properties.c_lat_coor1,
        lon: feature.properties.c_long_coor1,
        address,
        isOutside: feature.c_acc === "Extérieur",
        isFreeAccess: feature.c_acc_lib === true ? true : false
    };
});

app.get('/points', (request, response) => {
    const lat = request.query.lat;
    const lon = request.query.lon;
    const distance = Number(request.query.distance) || 2;

    const coords = {
        lat,
        lon
    };


    const filteredPointsByDistance = allPoints.filter((point) => {
        const pointCoords = {
            lat: point.lat,
            lon: point.lon
        };
        return isCoordinatesClose(coords, pointCoords, distance);
    });

    response.json({
        success: true,
        total: filteredPointsByDistance.length,
        points: filteredPointsByDistance
    });
});

app.listen(port, () => {
    console.log(`Server started port: ${port}`);
});