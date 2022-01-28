import { MessageActionRow, MessageButton, Permissions } from "discord.js";
import reactions from "../../assets/reactions";
import Command from "../../features/commands/classes/command";

const ban_cmd = new Command()
  .setName("ban")
  .setDescription("Bans one member.")
  .addParameter((p) => p.setName("member mention").setRequired(true))
  .setExecution(async ({ message }) => {
    let guildMember = await message.guild?.members.fetch(message.author.id);
    if (!guildMember?.permissions.has(Permissions.FLAGS.BAN_MEMBERS))
      return message.sendTextEmbed(
        `${reactions.error.random} You do not have the permission to ban members`
      );
    let memberToBan = message.mentions.members?.first();
    if (!memberToBan)
      return message.sendTextEmbed(
        `You need to mention the member you want to ban`
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

    let sent = await message.sendTextEmbed(
      `Are you really sure you want to ban ${memberToBan.toString()}`,
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
      memberToBan
        .ban()
        .then(() =>
          interaction.update({
            embeds: [
              message.returnTextEmbed(
                `Banned successfully ${memberToBan!.toString()}`
              ),
            ],
            components: [row],
          })
        )
        .catch(() =>
          interaction.update({
            embeds: [
              message.returnTextEmbed(
                `Failed to kick ${memberToBan!.toString()}`
              ),
            ],
            components: [row],
          })
        );
    } else if (interaction.customId === "cancel")
      interaction.update({
        embeds: [message.returnTextEmbed("Aborted")],
        components: [row],
      });
    else
      interaction.update({
        embeds: [message.returnTextEmbed("Kick has timeout")],
        components: [row],
      });
  })
  .addHelpCommand();

export default ban_cmd;
