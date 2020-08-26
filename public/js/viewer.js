let map;
let markers = new Map();

document.addEventListener("DOMContentLoaded", () => {
  const socket = io("/");

  setInterval(() => {
    socket.emit("requestLocations");
  }, 2000);

  socket.on("locationsUpdate", (locations) => {
    console.log(locations);
    locations.forEach(([id, position]) => {
      const marker = new google.maps.Marker({
        position,
        map,
        title: id,
      });

      if (markers.has(id)) {
        const oldMarker = markers.get(id);
        oldMarker.set(null);
        markers.delete(id);
        markers.set(id, marker);
      }
    });
  });
});

function initMap() {
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude: lat, longitude: lng } = pos.coords;
      map = new google.maps.Map(document.getElementById("map"), {
        center: { lat, lng },
        zoom: 8,
      });
    },
    (err) => console.log(err)
  );
}
