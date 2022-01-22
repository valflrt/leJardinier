import { MessageAttachment, MessageEmbed } from "discord.js";
import Canvas from "canvas";

import CCommand from "../../features/commands/classes/command";
import database from "../../features/database";
import Factorize from "../../features/factorize/factorize";

const rank_cmd = new CCommand()
  .setName("rank")
  .setDescription("Gives your stats/rank or the ones of the mentioned member")
  .addParameter((p) => p.setName("member mention").setRequired(false))
  .setExecution(async (messageInstance) => {
    let { methods, message } = messageInstance;

    let memberMention = message.mentions.members?.first();

    let member = memberMention?.user ?? message.author;

    let memberFromDB = await database.members.findOne({
      userId: member.id,
    });

    if (!memberFromDB?.stats)
      return methods.sendTextEmbed(`Couldn't find user stats !`);

    let XP = memberFromDB.stats!.xp!;
    let levelMaxXP = Math.floor(5 ** 1.1 * memberFromDB.stats!.level!);

    let width = 400;
    let height = 150;

    const canvas = Canvas.createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    ctx.textBaseline = "middle";

    // frame

    let linePad = 10;

    let frameRadius = 5;

    ctx.beginPath();
    ctx.moveTo(0, frameRadius);
    ctx.arcTo(0, 0, linePad, 0, frameRadius); // top left corner
    // alt method: ctx.arc(width - radiusPad, radiusPad, borderRadius, -Math.PI / 2, Math.PI);
    ctx.lineTo(width - linePad, 0); // top line
    ctx.arcTo(width, 0, width, linePad, frameRadius); // top right corner
    ctx.lineTo(width, height - linePad); // right line
    ctx.arcTo(width, height, width - linePad, height, frameRadius); // bottom right corner
    ctx.lineTo(linePad, height); // bottom line
    ctx.arcTo(0, height, 0, height - linePad, frameRadius); // bottom left corner
    ctx.lineTo(0, linePad); // left line
    ctx.fillStyle = "rgba(20, 20, 20, 0.2)";
    ctx.fill();
    ctx.closePath();

    // display username

    let tagX = 55; // x coordinate to write the user tag
    let leftMargin = 110;
    let tagFontSize = 30;

    ctx.font = `bold ${tagFontSize}px Sans`;
    while (leftMargin + ctx.measureText(member.tag).width > width - 20) {
      tagFontSize -= 0.1;
      ctx.font = `bold ${tagFontSize}px Sans`;
    }

    ctx.fillStyle = "#ffffff";
    ctx.fillText(member.username, leftMargin, tagX);
    ctx.fillStyle = "#878787";
    ctx.fillText(
      `#${member.discriminator}`,
      ctx.measureText(member.username).width + leftMargin,
      tagX
    );

    // display level

    ctx.fillStyle = "#ffffff";
    ctx.font = "18px Sans";
    ctx.fillText(`Level ${memberFromDB.stats.level}`, leftMargin + 2, 82);

    // main values to draw the line graph

    let barHeight = 8;
    let barHalfHeight = barHeight / 2;
    let barLength = 200;
    let barStart = leftMargin + barHalfHeight;
    let barEnd = barStart + barLength;
    let barTop = 95;
    let barBottom = barTop + barHeight;
    let barMiddle = barTop + barHalfHeight;

    // display xp at the end of the bar

    ctx.font = "bold 14px Sans";
    ctx.fillText(
      `${Factorize.fromNumber(XP)}/${Factorize.fromNumber(levelMaxXP)}`,
      barEnd + 12,
      barMiddle
    );

    // display xp bar graph bg

    ctx.beginPath();
    ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
    ctx.lineTo(barStart, barTop);
    ctx.lineTo(barEnd, barTop);
    ctx.arc(barEnd, barMiddle, barHalfHeight, -Math.PI / 2, Math.PI / 2); // right end
    ctx.lineTo(barEnd, barBottom);
    ctx.lineTo(barStart, barBottom);
    ctx.arc(barStart, barMiddle, barHalfHeight, Math.PI / 2, -Math.PI / 2); // left end
    ctx.fill();
    ctx.closePath();

    // display xp line graph

    let xpBarEnd = (XP / levelMaxXP) * barLength + barStart;

    ctx.beginPath();
    ctx.fillStyle = "#4CE821";
    ctx.lineTo(barStart, barTop);
    ctx.lineTo(xpBarEnd, barTop);
    ctx.arc(xpBarEnd, barMiddle, barHalfHeight, -Math.PI / 2, Math.PI / 2);
    ctx.lineTo(xpBarEnd, barBottom);
    ctx.lineTo(barStart, barBottom);
    ctx.arc(barStart, barMiddle, barHalfHeight, Math.PI / 2, -Math.PI / 2);
    ctx.fill();
    ctx.closePath();

    // crop around avatar image

    let avatarRadius = 31;
    ctx.beginPath();
    ctx.arc(60, height / 2, avatarRadius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    let avatarURL = member.avatarURL({ format: "png", size: 64 });
    if (avatarURL) {
      const avatar = await Canvas.loadImage(avatarURL);
      ctx.drawImage(
        avatar,
        60 - avatarRadius,
        height / 2 - avatarRadius,
        64,
        64
      );
    } else {
      ctx.rect(56, 61, 128, 128);
      ctx.fillStyle = "rgba(200, 200, 200, 0.5)";
      ctx.fill();
    }

    new MessageEmbed();

    methods.send({
      files: [new MessageAttachment(canvas.toBuffer(), "stats.png")],
      embeds: [
        methods.returnCustomEmbed((embed) =>
          embed.setImage("attachment://stats.png")
        ),
      ],
    });
  });

export default rank_cmd;
