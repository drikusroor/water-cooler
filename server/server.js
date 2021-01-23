import WebSocket from "ws";
const port = process.env.PORT || 9001;
const wss = new WebSocket.Server({ port });

import { contextualHandleAction } from "./actions/index.js";
import { ChannelCollection } from "./models/channel-collection.js";

console.log(`running on ws://127.0.0.1:${port}`);

const channelCollection = new ChannelCollection();

wss.on("connection", function connection(ws) {
  console.log("connected");

  const handleAction = contextualHandleAction(channelCollection, wss, ws);
  ws.on("message", handleAction);

  ws.send(JSON.stringify({ type: "message", payload: "Hey hallo!" }));
});
