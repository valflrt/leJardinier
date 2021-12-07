import { MessageActionRow, MessageButton, Permissions } from "discord.js";
import reactions from "../../assets/reactions";
import CCommand from "../../lib/commandManager/classes/command";

const kick = new CCommand()
	.setName("kick")
	.setDescription("Kicks one or more member(s).")
	.setExecution(async (messageInstance) => {
		let { methods, message } = messageInstance;

		let guildMember = await message.guild?.members.fetch(message.author.id);
		if (!guildMember?.permissions.has(Permissions.FLAGS.KICK_MEMBERS))
			return methods.sendTextEmbed(
				`${reactions.error.random()} You do not have the permission to kick members`
			);
		let mentions = message.mentions.members;
		if (!mentions)
			return methods.sendTextEmbed(
				`You need to mention the members you want to kick`
			);

		let row = new MessageActionRow().addComponents(
			new MessageButton()
				.setLabel("Yes")
				.setStyle("DANGER")
				.setCustomId("y"),
			new MessageButton()
				.setLabel("No")
				.setStyle("SECONDARY")
				.setCustomId("n")
		);

		let sent = await methods.sendTextEmbed(
			`Are you really sure you want to kick:\n`.concat(
				mentions.map((m) => m.toString()).join(", ")
			),
			{
				components: [row],
			}
		);

		sent.awaitMessageComponent({});

		mentions.forEach((m) => (m.kickable ? m.kick() : null));

		methods.sendTextEmbed(``);
	})
	.addHelpCommand();

export default kick;
