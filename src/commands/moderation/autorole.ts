import { MessageActionRow, MessageButton, Permissions } from "discord.js";
import { italic } from "@discordjs/builders";

import CCommand from "../../managers/commands/classes/command";
import CSubcommandPreview from "../../middlewares/formatting/subcommand";

import database from "../../managers/database";

const autorole = new CCommand()
    .setName("autorole")
    .setDescription("Autorole command")
    .setExecution((messageInstance) => {
        let { methods } = messageInstance;

        methods.sendCustomEmbed((embed) =>
            embed
                .setDescription("Here are the commands to use:")
                .addFields(CSubcommandPreview.createFields(autorole.commands))
        );
    })

    // set
    .addSubcommand((c) =>
        c
            .setName("set")
            .setDescription(
                "Adds a watcher on a message".concat(
                    "When a specific mention is added by a member, they get a specific role"
                )
            )
            .addParameter((p) => p.setName("role mention").setRequired(true))
            .setExecution(async (messageInstance) => {
                let { methods, message } = messageInstance;

                let guildFromDB = await database.guilds.findOne({
                    id: message.guildId!,
                });
                if (!guildFromDB?.autorole?.messageId)
                    return methods.sendTextEmbed(
                        "There already is an autorole watcher set !\n".concat(
                            `Use if you want to remove the existing one take a look at the subcommands.`
                        )
                    );

                let caller = await message.guild!.members.fetch(
                    message.author.id
                );
                if (!caller?.permissions.has(Permissions.FLAGS.ADMINISTRATOR))
                    return methods.sendTextEmbed(
                        "You do not have the permission to add the autorole !\n".concat(
                            italic("You must be administrator")
                        )
                    );

                let roleMention = message.mentions.roles.first();
                if (!roleMention)
                    return methods.sendTextEmbed(
                        "You need to specify the role to add automatically !"
                    );

                let reference = await message.fetchReference();

                let toAdd = {
                    messageId: message.id,
                    roleId: roleMention.id,
                };

                await database.guilds.updateOrCreateOne(
                    { id: message.guildId! },
                    {
                        autorole: toAdd,
                    },
                    { id: message.guildId!, autorole: toAdd }
                );

                /**
                 * TODO: When database remastered:
                 * save "reference.id" to database so on restart,
                 * the collector is auto re-added
                 */

                return methods.sendTextEmbed(
                    `Click the button below to receive the role: ${roleMention.toString()}`,
                    {
                        components: [
                            new MessageActionRow({
                                components: [
                                    new MessageButton()
                                        .setStyle("PRIMARY")
                                        .setCustomId("autorole")
                                        .setLabel("Receive"),
                                ],
                            }),
                        ],
                    }
                );
            })
    )

    // remove
    .addSubcommand((c) =>
        c.setName("remove").setDescription("Removes the current watcher")
    );

export default autorole;
