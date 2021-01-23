import { Channel } from "./channel.js";

export class ChannelCollection {
  constructor() {
    this.channels = [];
  }

  createChannel(name) {
    const channel = new Channel(this, name);
    this.channels.push(channel);
    console.log("Channel created %s", name);
    return channel;
  }
}
