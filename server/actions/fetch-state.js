import WebSocket from "ws";

import { formatAnswer } from "../helpers/format-answer.js";

export const fetchState = ({ ws, type }) => {
  const channel = ws.state.channel;

  const playerStates = channel.getPlayerStates();

  if (ws.readyState === WebSocket.OPEN) {
    ws.send(formatAnswer(type, playerStates));
  }
};
