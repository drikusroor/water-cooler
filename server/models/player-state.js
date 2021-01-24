import {
  uniqueNamesGenerator,
  adjectives,
  animals,
} from "unique-names-generator";

export class PlayerState {
  constructor(ws, id, name) {
    this.socket = ws;
    this.id = id;
    this.name =
      name ??
      uniqueNamesGenerator({
        dictionaries: [adjectives, animals],
        separator: "-",
        length: 2,
      });
    this.data = {};
  }

  get() {
    return {
      id: this.id,
      ...this.data,
    };
  }

  getFull() {
    return {
      ...this.get(),
      name: this.name,
    };
  }

  update(payload) {
    this.data = {
      ...this.data,
      ...payload,
    };
  }
}
