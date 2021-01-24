import { fetchState } from "./fetch-state.js";
import { channelJoin } from "./channel.js";
import { playerUpdate, playerDisconnect } from "./player.js";

const actionFunctionMapper = {
  CHANNEL_JOIN: channelJoin,
  PLAYER_UPDATE: playerUpdate,
  PLAYER_DISCONNECT: playerDisconnect,
  FETCH_STATE: fetchState,
};

export const contextualHandleAction = (channelCollection, wss, ws) => (
  action
) => {
  if (Buffer.isBuffer(action)) {
    action = JSON.parse(action.toString());
  }

  return actionFunctionMapper[action.type]
    ? actionFunctionMapper[action.type]({
        channelCollection,
        wss,
        ws,
        ...action,
      })
    : "Not a valid action";
};
