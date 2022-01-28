import { MessageActionRow, MessageButton, Permissions } from "discord.js";
import reactions from "../../assets/reactions";
import Command from "../../features/commands/classes/command";

const ban_cmd = new Command({
  name: "ban",
  description: "Bans one member.",
  parameters: [{ name: "member mention", required: true }],
  execution: async ({ actions, message }) => {
    let guildMember = await message.guild?.members.fetch(message.author.id);
    if (!guildMember?.permissions.has(Permissions.FLAGS.BAN_MEMBERS))
      return actions.sendTextEmbed(
        `${reactions.error.random} You do not have the permission to ban members`
      );
    let memberToBan = message.mentions.members?.first();
    if (!memberToBan)
      return actions.sendTextEmbed(
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

    let sent = await actions.sendTextEmbed(
      `Are you really sure you want to ban ${memberToBan.toString()}`,
      {
        components: [row],
      }
    );

    let interaction = await sent.message.awaitMessageComponent({
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
              actions.returnTextEmbed(
                `Banned successfully ${memberToBan!.toString()}`
              ),
            ],
            components: [row],
          })
        )
        .catch(() =>
          interaction.update({
            embeds: [
              actions.returnTextEmbed(
                `Failed to kick ${memberToBan!.toString()}`
              ),
            ],
            components: [row],
          })
        );
    } else if (interaction.customId === "cancel")
      interaction.update({
        embeds: [actions.returnTextEmbed("Aborted")],
        components: [row],
      });
    else
      interaction.update({
        embeds: [actions.returnTextEmbed("Kick has timeout")],
        components: [row],
      });
  },
});

export default ban_cmd;
