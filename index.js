"use strict";

const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const locationMap = new Map();

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.send("Hello!");
});

io.on("connection", (socket) => {
  socket.on("registerTracker", () => {
    locationMap.set(socket.id, { lat: null, lng: null });
    console.log("register tracker");
  });

  socket.on("updateLocation", (pos) => {
    if (locationMap.has(socket.id)) {
      locationMap.set(socket.id, pos);
      console.log(socket.id, pos);
    }
  });

  socket.on("requestLocations", () => {
    socket.emit("locationsUpdate", Array.from(locationMap));
  });

  socket.on("disconnect", () => {
    locationMap.delete(socket.id);
  });
});

server.listen(3000, (err) => {
  if (err) {
    throw err;
  }
  console.log("server is running");
});
