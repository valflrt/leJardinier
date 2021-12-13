import { MessageActionRow, MessageButton, Permissions } from "discord.js";
import reactions from "../../assets/reactions";
import CCommand from "../../managers/commands/classes/command";

const kick = new CCommand()
	.setName("kick")
	.setDescription("Kicks one member.")
	.addParameter((p) => p.setName("member mention").setRequired(true))
	.setExecution(async (messageInstance) => {
		let { methods, message } = messageInstance;

		let guildMember = await message.guild?.members.fetch(message.author.id);
		if (!guildMember?.permissions.has(Permissions.FLAGS.KICK_MEMBERS))
			return methods.sendTextEmbed(
				`${reactions.error.random()} You do not have the permission to kick members`
			);
		let memberToKick = message.mentions.members?.first();
		if (!memberToKick)
			return methods.sendTextEmbed(
				`You need to mention the member you want to kick`
			);

		let row = new MessageActionRow().addComponents(
			new MessageButton()
				.setLabel("Confirm")
				.setStyle("DANGER")
				.setCustomId("confirm"),
			new MessageButton()
				.setLabel("Cancel")
				.setStyle("SECONDARY")
				.setCustomId("cancel")
		);

		let sent = await methods.sendTextEmbed(
			`Are you really sure you want to kick ${memberToKick.toString()}`,
			{
				components: [row],
			}
		);

		let interaction = await sent.awaitMessageComponent({
			componentType: "BUTTON",
			time: 3e5,
		});

		row.components.forEach((c) => c.setDisabled());
		if (interaction.customId === "confirm") {
			memberToKick
				.kick()
				.then(() =>
					interaction.update({
						embeds: [
							methods.returnTextEmbed(
								`Kicked successfully ${memberToKick!.toString()}`
							),
						],
						components: [row],
					})
				)
				.catch(() =>
					interaction.update({
						embeds: [
							methods.returnTextEmbed(
								`Failed to kick ${memberToKick!.toString()}`
							),
						],
						components: [row],
					})
				);
		} else if (interaction.customId === "cancel")
			interaction.update({
				embeds: [methods.returnTextEmbed("Aborted")],
				components: [row],
			});
		else
			interaction.update({
				embeds: [methods.returnTextEmbed("Kick has timeout")],
				components: [row],
			});
	})
	.addHelpCommand();

export default kick;
