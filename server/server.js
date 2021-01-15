const WebSocket = require("ws");
const lowestUnusedNumber = require("./helpers/lowest-number");

const port = process.env.PORT || 9001;
const timeout = process.env.TIMEOUT || 10000;
const cleanupAfterTimeout = process.env.CLEANUP_AFTER_TIMEOUT;
const wss = new WebSocket.Server({ port });

const messageTypes = {
  REQUEST_ID: "REQUEST_ID",
  ASSIGN_ID: "ASSIGN_ID",
  GAME_STATE: "GAME_STATE",
  PLAYER_STATE: "PLAYER_STATE",
};

let gameState = [];

console.log(`running on ws://127.0.0.1:${port}`);

const handleRequestID = (ws, payload) => {
  const playerId =
    gameState.length > 0
      ? lowestUnusedNumber(
          gameState.map((player) => player.id),
          1
        )
      : 1;
  ws.send(JSON.stringify({ type: messageTypes.ASSIGN_ID, payload: playerId }));
};

const mapPlayerToPayload = ({ id, x, y }) => {
  return { id, x, y };
};

const handlePlayerMutation = (ws, payload) => {
  gameState = gameState.map((el) => {
    if (el.id === payload.id) {
      return { ...payload, modified: new Date() };
    } else {
      return el;
    }
  });
  if (gameState.filter((el) => el.id === payload.id).length > 0) {
  } else {
    gameState.push({ ...payload, modified: new Date() });
    console.log(
      `player added to world, id: ${payload.id}, players: ${gameState.length}`
    );
  }

  ws.send(
    JSON.stringify({
      type: messageTypes.GAME_STATE,
      payload: gameState.map(mapPlayerToPayload),
    })
  );
};

const handleMessage = (ws) => (message) => {
  const data = JSON.parse(message);

  if (data.type === messageTypes.REQUEST_ID) {
    handleRequestID(ws);
  } else if (data.type === messageTypes.PLAYER_STATE) {
    handlePlayerMutation(ws, data.payload);
  }
};

const handleCloseConnection = (ws) => (code, reason) => {
  gameState = gameState.filter((el) => el.id != parseInt(reason));
  console.log(`player ${reason} disconnected`);
};

const handleTimeout = () => {
  const currentTime = new Date().getTime();
  gameState = gameState.filter((player) => {
    const diff = currentTime - player.modified.getTime();
    if (diff > timeout) {
      console.log(`player ${player.id} r3moved for timeout reasonz`);
      return false;
    } else {
      true;
    }
  });
};

const handleConnection = (ws) => {
  ws.on("message", handleMessage(ws));
  ws.on("close", handleCloseConnection(ws));

  if (cleanupAfterTimeout) {
    setInterval(handleTimeout, 2500);
  }
};

wss.on("connection", handleConnection);
