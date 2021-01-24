import { generateGuid } from "../helpers/guid.js";

export class Channel {
  constructor(channelCollection, name) {
    this.channelCollection = channelCollection;
    this.name = name;
    this.players = [];
  }

  join(ws) {
    ws.state.channel = this;
    ws.state.data = {
      ...ws.state.data,
    };

    this.players.push(ws);
    console.log(
      "%s joined %s. %s players.",
      ws.state.name,
      this.name,
      this.players.length
    );
  }

  leave(ws) {
    this.players = this.players.filter((player) => player !== ws);
    console.log(
      "%s left %s. %s players",
      ws.state.name,
      this.name,
      this.players.length
    );
    return this.players;
  }

  getPlayerStates() {
    return this.players.map((player) => player.state.getFull());
  }
}
