import { Client, ClientOptions } from "discord.js";

import config from "../config";
import listeners from "./listeners";

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
   * makes the client login and sets listeners when the bot is ready (= starts the bot)
   */
  public async start() {
    await this.client.login(config.secrets.token!);
    this.client = await new Promise<Client>((resolve) =>
      this.client.once("ready", resolve)
    );
    await listeners.onReady(this.client);
    this.setListeners();
  }

  /**
   * sets bot listeners (once bot started: prevents too early event calls and
   * resulting errors)
   */
  private setListeners() {
    this.client.on("messageCreate", listeners.onMessageCreate);
    this.client.on("interactionCreate", listeners.onInteractionCreate);
    this.client.on("guildMemberAdd", listeners.onMemberAdd);
  }
}
