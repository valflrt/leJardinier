import { MessageActionRow, MessageButton } from "discord.js";

export const linkButton = (label: string, url: string) =>
	new MessageActionRow().addComponents(
		new MessageButton().setLabel(label).setURL(url)
	);
