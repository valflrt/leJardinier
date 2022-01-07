import { MessageAttachment, MessageEmbed } from "discord.js";
import Canvas from "canvas";

import CCommand from "../../managers/commands/classes/command";
import database from "../../managers/database";

const stats = new CCommand()
  .setName("stats")
  .setDescription("Gives user stats")
  .setExecution(async (messageInstance) => {
    let { methods, message } = messageInstance;

    let member = await database.members.findOne({ userId: message.author.id });

    if (!member?.stats)
      return methods.sendTextEmbed(`Couldn't find your stats !`);

    let XP = member.stats!.xp!;
    let levelMaxXP = Math.floor(5 ** 1.1 * member.stats!.level!);

    const canvas = Canvas.createCanvas(700, 250);
    const ctx = canvas.getContext("2d");

    // frame

    ctx.beginPath();
    ctx.fillStyle = "rgba(20, 20, 20, 0.2)";
    ctx.lineTo(20, 0);
    ctx.lineTo(680, 0);
    ctx.arc(690, 10, 10, 0, Math.PI * 2, false);
    ctx.lineTo(700, 20);
    ctx.lineTo(700, 230);
    ctx.arc(690, 240, 10, 0, Math.PI * 2, true);
    ctx.lineTo(680, 250);
    ctx.lineTo(20, 250);
    ctx.arc(10, 240, 10, 0, Math.PI * 2, true);
    ctx.lineTo(0, 230);
    ctx.lineTo(0, 20);
    ctx.arc(10, 10, 10, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.closePath();

    // main x coordinate for text

    let basex = 210;

    // display username

    let fontSize = 60;

    do {
      ctx.font = `bold ${(fontSize -= 5)}px Sans`;
    } while (basex + ctx.measureText("valflrt#8436").width > canvas.width);

    ctx.fillStyle = "#ffffff";
    ctx.fillText("valflrt", basex, 115);
    ctx.fillStyle = "#878787";
    ctx.fillText("#8436", ctx.measureText("valflrt").width + basex, 114);

    // display level

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 28px Sans";
    ctx.fillText(`Level ${member.stats.level}`, basex, 149);

    // main values to draw the line graph

    let lineStart = basex + 6;
    let lineEnd = lineStart + 300;
    let lineLength = Math.abs(lineStart - lineEnd);
    let lineTop = 160;
    let lineBottom = 176;
    let lineMiddle = Math.round((lineTop + lineBottom) / 2);
    let radius = Math.abs(lineTop - lineBottom) / 2;

    // display xp

    ctx.font = "bold 24px Sans";
    ctx.fillText(`${XP}/${levelMaxXP}`, lineEnd + 20, 175);

    // display xp line graph bg

    ctx.beginPath();
    ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
    ctx.lineTo(lineStart, lineTop);
    ctx.lineTo(lineEnd, lineTop);
    ctx.arc(lineEnd, lineMiddle, radius, 0, Math.PI * 2, false);
    ctx.lineTo(lineEnd, lineBottom);
    ctx.lineTo(lineStart, lineBottom);
    ctx.arc(lineStart, lineMiddle, radius, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.closePath();

    // display xp line graph

    let xpEnd = (XP / levelMaxXP) * lineLength + lineStart;

    ctx.beginPath();
    ctx.fillStyle = "#4CE821";
    ctx.lineTo(lineStart, lineTop);
    ctx.lineTo(xpEnd, lineTop);
    ctx.arc(xpEnd, lineMiddle, radius, 0, Math.PI * 2, false);
    ctx.lineTo(xpEnd, lineBottom);
    ctx.lineTo(lineStart, lineBottom);
    ctx.arc(lineStart, lineMiddle, radius, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.closePath();

    // crop around avatar image

    ctx.beginPath();
    ctx.arc(120, 125, 62, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    let avatarURL = message.author.avatarURL({ format: "png", size: 128 });
    if (avatarURL) {
      const avatar = await Canvas.loadImage(avatarURL);
      ctx.drawImage(avatar, 56, 61);
    } else {
      ctx.rect(56, 61, 128, 128);
      ctx.fillStyle = "rgba(200, 200, 200, 0.5)";
      ctx.fill();
    }

    const statsImage = new MessageAttachment(canvas.toBuffer(), "stats.png");

    new MessageEmbed();

    methods.send({
      files: [statsImage],
      embeds: [
        methods.returnCustomEmbed((embed) =>
          embed.setImage("attachment://stats.png")
        ),
      ],
    });
  });

export default stats;
