import Player from "./player.js";
import controls from "./controls.js";
// const Player = require("Player.js");
window.onload = function() {
  const socket = io(),
  canvas = document.getElementById("game"),
  // console.log(canvas),
  ctx = canvas.getContext("2d");

// const writeToCanvas = msg => {
//     ctx.fillStyle = "black";
//     ctx.font = "20px";
//     ctx.fillText(msg , 30, 30);

// }
// var img = '../assets/images/char3.png';
//        img.src = 
var img = document.getElementById('source');

let players = [];
let count = 0;
socket.on("init", ({ id, plyrs }) => {
  // const player = new Player({ id });
  // socket.emit()
  // writeToCanvas("Connected");
  let type = "image";
  let w;
  let h;
  let x;
  let y;

  let player = new Player({ id, w, h, img, x, y, type});
  // console.log(plyrs.length);
  controls(player, socket);
  socket.emit("new-player", player);
  //This especially runs on other machines...
  socket.on("new-player", (obj) => {
    console.log("newplayer")
    console.log(id)
    players.push(new Player(obj));
  });
  players = plyrs.map((v) => new Player(v)).concat(player);
  var directory;
  socket.on("move-player", ({ id, dir }) => {
    console.log("move-player");
    console.log(id);
    console.log(dir);
    let p = players.find((v) => v.id === id);
    console.log(p);
    p.move(dir);
    draw();
  });
  socket.on("update-player", ({ obj }) => {
    let i = players.findIndex(p => p.id === obj.id);
    if(i < 0) {
      return;
    }
    players[i].x = obj.x;
    players[i].y = obj.y;

    draw();
  });
  console.log(players);
  socket.on("stop-player", ({ id, dir }) => {
    players.find((v) => v.id === id).stop(dir)
    draw();
  });
  socket.on("remove-player", ({ id }) => {
    let i = players.findIndex((v) => v.id === id);
    console.log("remove " + i);
    players.splice(i,1);
    draw();
  });

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    players.forEach((v) => v.draw(ctx));

    requestAnimationFrame(draw);
  };

  draw();
});

}
