import { generateGuid } from "../helpers/guid.js";

export class Channel {
  constructor(channelCollection, name) {
    this.channelCollection = channelCollection;
    this.name = name;
    this.players = [];
  }

  joinChannel(ws) {
    ws.channel = this;
    ws.state = {
      ...ws.state,
      id: generateGuid(),
    };

    this.players.push(ws);
    console.log("%s joined %s", ws.state.id, this.name);
  }
}
