import Player from "./player.js";
import controls from "./controls.js";
// const Player = require("Player.js");
const socket = io(),
canvas = document.getElementById("game"),
// console.log(canvas),
ctx= canvas.getContext("2d");

// const writeToCanvas = msg => {
//     ctx.fillStyle = "black";
//     ctx.font = "20px";
//     ctx.fillText(msg , 30, 30);

// }
let players=[];
  socket.on("init" , ({id, plyrs}) => {
    // const player = new Player({ id });
    // socket.emit()
    // writeToCanvas("Connected");
    let player = new Player( {id} );
    controls(player, socket);
    socket.emit("new-player", player);
    //This especially runs on other machines...
    socket.on("new-player", obj => players.push(new Player(obj)));
    players = plyrs.map(v => new Player(v)).concat(player);
var directory;
    socket.on("move-player", ({id, dir}) =>
    
     players.find(v => v.id === id).move(dir)
    
     );
    console.log(players);
    socket.on("stop-player", ({id, dir}) =>
    players.find(v => v.id === id).stop(dir)
    );

    const draw = () => {
        ctx.clearRect(0 , 0, canvas.width, canvas.height);

        players.forEach(v => v.draw(ctx));

        requestAnimationFrame(draw);
    }
    
draw();

  })