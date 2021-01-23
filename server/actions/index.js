import { joinChannel } from "./join-channel.js";

const actionFunctionMapper = {
  JOIN_CHANNEL: joinChannel,
};

export const contextualHandleAction = (channelCollection, wss, ws) => (
  action
) => {
  action = JSON.parse(action.toString());
  return actionFunctionMapper[action.type]({
    channelCollection,
    wss,
    ws,
    ...action,
  });
};
