const express = require('express');
const main = express();
const path = require("path");

//Socket.io boiler plate or Setup 5-9
const http = require("http");
const socketio = require("socket.io");
const server = http.createServer(main);
const io = socketio(server);

//ejs setup
main.set("view engine", "ejs");
main.use(express.static(path.join(__dirname, "public")));


io.on("connection", function (socket){
    socket.on("send-location", function (data) {
        io.emit("receive-location", {id: socket.id, ...data});
    });
    
    socket.on("disconnect", function(){
        io.emit("user-disconnected")
    })
});



main.get("/", function(req, res){
    res.render("index");
});

server.listen(3500);