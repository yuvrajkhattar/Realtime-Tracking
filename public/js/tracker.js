document.addEventListener("DOMContentLoaded", () => {
  const socket = io("/");
  socket.emit("registerTracker");
  console.log("emiting register tracker");

  const positionOptions = {
    enableHighAccuracy: true,
    maximumAge: 0,
  };

  setInterval(() => {
    console.log("tick");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        socket.emit("updateLocation", { lat, lng });
        console.log(lat, lng);
      },
      (err) => {
        console.log(err);
      },
      positionOptions
    );
  }, 2000);
});
