import { Client, ClientEvents } from "discord.js";

export interface IListenerCollectionOptions {
  type?: "on" | "once";
}

export interface ListenerCollectionMap {
  listener: (...args: ClientEvents[keyof ClientEvents]) => Promise<void>;
  options: IListenerCollectionOptions;
}

export default class ListenerCollection {
  private map = new Map<keyof ClientEvents, ListenerCollectionMap>();

  public set<K extends keyof ClientEvents>(
    event: K,
    listener: (...args: ClientEvents[K]) => Promise<void>,
    options: IListenerCollectionOptions = {}
  ) {
    this.map.set(event, {
      listener: listener as (
        ...args: ClientEvents[keyof ClientEvents]
      ) => Promise<void>,
      options,
    });
  }

  public apply(client: Client) {
    this.map.forEach((v, k) => {
      switch (v.options.type) {
        case "on":
          client.on(k, v.listener);
          break;
        case "once":
          client.once(k, v.listener);
          break;
        default:
          client.on(k, v.listener);
          break;
      }
    });
  }
}
