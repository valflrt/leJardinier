import { Client, ClientOptions } from "discord.js";

import listeners, { ready } from "./listeners";

import config from "../config";

export default class LeJardinier {
  public client: Client;

  /**
   * Creates client object
   * @param options client options
   */
  constructor(options: ClientOptions) {
    this.client = new Client(options);
  }

  /**
   * Makes the client login and sets listeners when the bot is ready (= starts the bot)
   */
  public async start() {
    await this.client.login(config.secrets.token!);
    this.client = await new Promise<Client<true>>((resolve) =>
      this.client.once("ready", async (client) => {
        await ready(client); // stuff to do when the bot is ready
        resolve(client);
      })
    );
    listeners.apply(this.client); // applies event listeners
  }
}
