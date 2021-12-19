import { MessageActionRow, MessageButton } from "discord.js";

export const linkButton = (label: string, url: string) =>
  new MessageActionRow().addComponents(
    new MessageButton().setStyle("LINK").setLabel(label).setURL(url)
  );
