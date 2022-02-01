import { Client, ClientOptions } from "discord.js";

import listeners from "./listeners";
import { connectDatabase } from "../features/database";

import log from "./log";

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
    this.client = await new Promise<Client>((resolve) =>
      this.client.once("ready", resolve)
    );
    listeners.apply(this.client);
    this.ready();
  }

  /**
   * Things to do when the bot is ready
   */
  public async ready() {
    try {
      await connectDatabase();
      log.database.connectionSuccess();
    } catch (e) {
      log.database.connectionFailure(e);
    }

    this.client.user!.setActivity({
      name: `${config.prefix}help`,
      type: "WATCHING",
    });

    log.logger.connectionSuccess(this.client.user!.tag, this.client.user!.id);
  }
}
