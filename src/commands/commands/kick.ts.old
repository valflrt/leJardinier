import { MessageActionRow, MessageButton, Permissions } from "discord.js";
import reactions from "../../assets/reactions";
import Command from "../../features/commands/classes/command";

const kick_cmd = new Command({
  name: "kick",
  description: "Kicks one member.",
  parameters: [{ name: "member mention", required: true }],
  execution: async ({ actions, message }) => {
    let guildMember = await message.guild?.members.fetch(message.author.id);
    if (!guildMember?.permissions.has(Permissions.FLAGS.KICK_MEMBERS))
      return actions.sendTextEmbed(
        `${reactions.error.random} You do not have the permission to kick members`
      );
    let memberToKick = message.mentions.members?.first();
    if (!memberToKick)
      return actions.sendTextEmbed(
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

    let sent = await actions.sendTextEmbed(
      `Are you really sure you want to kick ${memberToKick.toString()}`,
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
      memberToKick
        .kick()
        .then(() =>
          interaction.update({
            embeds: [
              actions.returnTextEmbed(
                `Kicked successfully ${memberToKick!.toString()}`
              ),
            ],
            components: [row],
          })
        )
        .catch(() =>
          interaction.update({
            embeds: [
              actions.returnTextEmbed(
                `Failed to kick ${memberToKick!.toString()}`
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

export default kick_cmd;
