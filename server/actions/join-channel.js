import WebSocket from "ws";

import { returnType } from "../helpers/return-type.js";

export const joinChannel = ({ channelCollection, wss, ws, type, payload }) => {
  let channel = channelCollection.channels.find((c) => c.name === payload);

  if (!channel) {
    channel = channelCollection.createChannel(payload);
  }
  channel.joinChannel(ws);

  channel.players.forEach(function each(player) {
    if (player.readyState === WebSocket.OPEN) {
      player.send(
        JSON.stringify({
          type: returnType(type),
          payload: player.state,
          forMe: ws === player,
        })
      );
    }
  });
};
