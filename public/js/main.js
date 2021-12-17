const cities = [{
    name: 'Paris',
    lat: 48.854652, 
    lon: 2.346553
}, {
    name: 'Marseille',
    lat: 43.296011, 
    lon: 5.375329
}, {
    name: 'Bordeaux',
    lat: 44.844282, 
    lon: -0.586840 
}, {
    name: 'Lyon',
    lat: 45.757456, 
    lon: 4.832680
}, {
    name: 'Nîmes',
    lat: 43.835330, 
    lon: 4.359094
}, {
    name: 'Annecy',
    lat: 45.905597, 
    lon: 6.125936
}];


const cityIndex = 1;
const distance = 2;

let markers = [];


var map = L.map('map').setView([cities[cityIndex].lat,cities[cityIndex].lon], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
}).addTo(map);



const getCityData = (cityInfo, distance = 2) => {
    
    map.setView([cityInfo.lat, cityInfo.lon], 13);
    fetchData(cityInfo.lat, cityInfo.lon, distance);
}


const fetchData = async (lat, lon, distance) => {
    markers.forEach((m) => {
        map.removeLayer(m);
    });
    markers = [];

    const response = await fetch(`/points?lat=${lat}&lon=${lon}&distance=${distance}`);
    const json = await response.json();
    console.log("🚀 ~ file: main.js ~ line 16 ~ fetchData ~ json", json)
    const points = json.points;
    console.log("🚀 ~ file: main.js ~ line 18 ~ fetchData ~ points", points.length);


    for (const dataMarker of points) {
        const marker = L.marker([dataMarker.lat, dataMarker.lon]);
        marker.addTo(map);
        marker.bindPopup(`<div>${dataMarker.name}</div><div>${dataMarker.address}</div><div>Accessible extérieur : ${dataMarker.isOutside ? "Oui" : "Non"}</div>`);
        
        markers.push(marker);
    }


};


getCityData(cities[cityIndex]);


document.querySelectorAll('li').forEach((el) => {
    el.addEventListener('click', ({ target }) => {
        const index = Number(target.dataset.index);
        getCityData(cities[index]);
    });
});