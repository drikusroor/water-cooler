import WebSocket from "ws";
import { formatAnswer } from "../helpers/format-answer.js";

export const channelJoin = ({ channelCollection, ws, type, payload }) => {
  let channel = channelCollection.channels.find((c) => c.name === payload);

  if (!channel) {
    channel = channelCollection.createChannel(payload);
  }
  channel.join(ws);

  channel.players.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      if (ws === client) {
        const message = `Hello ${client.state.name}! Welcome to ${channel.name}`;
        ws.send(JSON.stringify({ type: "MESSAGE", payload: message }));
      }

      console.log("Join channel, isPlayer: %s", Boolean(ws === client));

      client.send(
        formatAnswer(type, ws.state.getFull(), {
          isPlayer: Boolean(ws === client),
          channelName: channel.name,
        })
      );
    }
  });
};
