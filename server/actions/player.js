import WebSocket from "ws";

import { formatAnswer } from "../helpers/format-answer.js";

export const playerUpdate = ({ ws, type, payload }) => {
  const channel = ws.state.channel;

  ws.state.update(payload);

  channel.players.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      if (ws !== client) {
        client.send(formatAnswer(type, ws.state.get(), { isPlayer: false }));
      }
    }
  });
};

export const playerDisconnect = ({ ws, type }) => {
  const channel = ws.state.channel;

  // leave channel if applicable
  ws.state.channel?.leave(ws);

  channel?.players.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(formatAnswer(type, ws.state.id));
    }
  });
};
