const WebSocket = require("ws");
const lowestUnusedNumber = require("./helpers/lowest-number");

const port = process.env.PORT || 9001;
const wss = new WebSocket.Server({ port: port });

const messageTypes = {
  REQUEST_ID: "REQUEST_ID",
  ASSIGN_ID: "ASSIGN_ID",
  GAME_STATE: "GAME_STATE",
  PLAYER_STATE: "PLAYER_STATE",
};

let gameState = [];

console.log(`running on ws://127.0.0.1:${port}`);

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    const data = JSON.parse(message);

    if (data.type === messageTypes.REQUEST_ID) {
      const playerId =
        gameState.length > 0
          ? lowestUnusedNumber(
              gameState.map((player) => player.id),
              1
            )
          : 1;
      ws.send(
        JSON.stringify({ type: messageTypes.ASSIGN_ID, payload: playerId })
      );
    } else if (data.type === messageTypes.PLAYER_STATE) {
      const { payload } = data;

      gameState = gameState.map((el) => {
        if (el.id === payload.id) return payload;
        else return el;
      });
      if (gameState.filter((el) => el.id === payload.id).length > 0) {
      } else {
        console.log(`player added to world, id: ${payload.id}`);
        gameState.push(payload);
      }

      ws.send(
        JSON.stringify({ type: messageTypes.GAME_STATE, payload: gameState })
      );
    }
  });

  ws.on("close", (code, reason) => {
    gameState = gameState.filter((el) => el.id != parseInt(reason));
    console.log(`player ${reason} disconnected`);
  });
});
