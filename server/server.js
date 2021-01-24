import WebSocket from "ws";
const port = process.env.PORT || 9001;
const wss = new WebSocket.Server({ port });

import { contextualHandleAction } from "./actions/index.js";
import { generateGuid } from "./helpers/guid.js";
import { ChannelCollection } from "./models/channel-collection.js";
import { PlayerState } from "./models/player-state.js";

console.log(`running on ws://127.0.0.1:${port}`);

const channelCollection = new ChannelCollection();

wss.on("connection", function connection(ws) {
  console.log("connected");

  let playerId = generateGuid(5);

  // regenerate player id if it already exists
  while (
    Array.from(wss.clients).some((client) => client.state?.id === playerId)
  ) {
    playerId = generateGuid(6);
  }

  ws.state = new PlayerState(ws, playerId);

  const handleAction = contextualHandleAction(channelCollection, wss, ws);
  ws.on("message", handleAction);

  ws.on("close", function close() {
    handleAction({ type: "PLAYER_DISCONNECT", payload: { id: ws.state.id } });
    console.log("disconnected");
  });
});
