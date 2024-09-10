const socket = io();

if(navigator.geolocation){
    navigator.geolocation.watchPosition(
        (position) => {
        const { latitude, longitude } = position.coords;
        socket.emit("send-location", {latitude, longitude});
        }, 
        (error)=>{
        console.error(error);
        },
        {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
        }
    );
}

const map = L.map("map").setView( [0,0], 16);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution : "Shubham Gadekar"
}).addTo(map)

const mrk = {};

socket.on("receive-location", (data) => {
    const { id, latitude, longitude } = data;
    map.setView([latitude, longitude]);
    if(mrk[id]){
        mrk[id].setLatLng([latitude, longitude]);
    } else {
        mrk[id] =  L.marker([latitude, longitude]).addTo(map);
    }
});

socket.on("user-disconnect", (id) => {
    if(mrk[id]){
        map.removeLayer(mrk[id]);
        delete mrk[id];
    }
})