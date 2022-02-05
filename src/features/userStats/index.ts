import { User } from "discord.js";
import { createCanvas, loadImage, registerFont } from "canvas";

import Quantify from "../quantify";

import StatsSchema from "../database/schemas/stats";
import database from "../database";

export default class UserStats {
  private member: User;
  private stats: Required<StatsSchema>;
  private guildId: string;

  constructor(member: User, stats: StatsSchema, guildId: string) {
    this.member = member;
    this.stats = stats as Required<StatsSchema>;
    this.guildId = guildId;
  }

  public async generatePreview() {
    let XP = this.stats.xp!;
    let levelMaxXP = Math.floor(5 ** 1.1 * this.stats.level!);

    let canvasWidth = 700;
    let canvasHeight = 200;

    registerFont("src/assets/OpenSans.ttf", {
      family: "OpenSansRegular",
      weight: "500",
    });

    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext("2d");

    ctx.textBaseline = "middle";

    // frame

    let cornerPad = 20;
    let frameRadius = 10;

    ctx.beginPath();
    ctx.moveTo(0, frameRadius);
    ctx.arcTo(0, 0, cornerPad, 0, frameRadius); // top left corner
    // alt method: ctx.arc(width - radiusPad, radiusPad, borderRadius, -Math.PI / 2, Math.PI);
    ctx.lineTo(canvasWidth - cornerPad, 0); // top line
    ctx.arcTo(canvasWidth, 0, canvasWidth, cornerPad, frameRadius); // top right corner
    ctx.lineTo(canvasWidth, canvasHeight - cornerPad); // right line
    ctx.arcTo(
      canvasWidth,
      canvasHeight,
      canvasWidth - cornerPad,
      canvasHeight,
      frameRadius
    ); // bottom right corner
    ctx.lineTo(cornerPad, canvasHeight); // bottom line
    ctx.arcTo(0, canvasHeight, 0, canvasHeight - cornerPad, frameRadius); // bottom left corner
    ctx.lineTo(0, cornerPad); // left line
    ctx.fillStyle = "rgba(20, 20, 20, 0.2)";
    ctx.fill();
    ctx.closePath();

    // information panel

    let centerY = canvasHeight / 2;

    let panelX = 200;
    let tagFontSize = 50;

    ctx.font = `bold ${tagFontSize}px OpenSans`;
    while (panelX + ctx.measureText(this.member.tag).width > canvasWidth - 40) {
      tagFontSize -= 0.1;
      ctx.font = `bold ${tagFontSize}px OpenSans`;
    }

    let tagRelativeY = centerY - 36;

    ctx.fillStyle = "#ffffff";
    ctx.fillText(this.member.username, panelX, tagRelativeY);
    ctx.fillStyle = "#878787";
    ctx.fillText(
      `#${this.member.discriminator}`,
      panelX + ctx.measureText(this.member.username).width,
      tagRelativeY
    );

    // display user info

    let array = await database.members.collection
      .find({ guildId: this.guildId })
      .sort({ "stats.totalXp": -1 })
      .toArray();

    let rank = array?.findIndex((m) => m.userId === this.member.id);

    ctx.fillStyle = "#ffffff";
    ctx.font = "26px OpenSans";
    ctx.fillText(
      `Level ${this.stats.level} • Server rank: ${
        rank === 0 || rank !== undefined ? `#${rank + 1}` : "Unranked"
      }`,
      panelX + 4,
      centerY + 8
    );

    // main values to draw the line graph

    let barHeight = 16;
    let barHalfHeight = barHeight / 2;
    let barLength = 360;
    let barLeft = panelX + barHalfHeight;
    let barRight = barLeft + barLength;
    let barTop = centerY + 28;
    let barBottom = barTop + barHeight;
    let barMiddle = barTop + barHalfHeight;

    // display xp at the end of the bar

    ctx.font = "bold 24px OpenSans";
    ctx.fillText(
      `${Quantify.parseNumber(XP)}/${Quantify.parseNumber(levelMaxXP)} xp`,
      barRight + 24,
      barMiddle
    );

    // display xp bar graph bg

    ctx.beginPath();
    ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
    ctx.lineTo(barLeft, barTop);
    ctx.lineTo(barRight, barTop);
    ctx.arc(barRight, barMiddle, barHalfHeight, -Math.PI / 2, Math.PI / 2); // right end
    ctx.lineTo(barRight, barBottom);
    ctx.lineTo(barLeft, barBottom);
    ctx.arc(barLeft, barMiddle, barHalfHeight, Math.PI / 2, -Math.PI / 2); // left end
    ctx.fill();
    ctx.closePath();

    // display xp line graph

    let xpBarEnd = (XP / levelMaxXP) * barLength + barLeft;

    ctx.beginPath();
    ctx.fillStyle = "#4CE821";
    ctx.lineTo(barLeft, barTop);
    ctx.lineTo(xpBarEnd, barTop);
    ctx.arc(xpBarEnd, barMiddle, barHalfHeight, -Math.PI / 2, Math.PI / 2);
    ctx.lineTo(xpBarEnd, barBottom);
    ctx.lineTo(barLeft, barBottom);
    ctx.arc(barLeft, barMiddle, barHalfHeight, Math.PI / 2, -Math.PI / 2);
    ctx.fill();
    ctx.closePath();

    // crop around avatar image

    let avatarRadius = 63;
    let avatarX = 40;

    ctx.beginPath();
    ctx.arc(
      avatarX + avatarRadius,
      canvasHeight / 2,
      avatarRadius,
      0,
      Math.PI * 2
    );
    ctx.closePath();
    ctx.clip();

    let avatarURL = this.member.avatarURL({ format: "png", size: 128 });
    if (avatarURL) {
      const avatar = await loadImage(avatarURL);
      ctx.drawImage(avatar, avatarX, canvasHeight / 2 - avatarRadius, 128, 128);
    } else {
      ctx.rect(avatarX, 61, 128, 128);
      ctx.fillStyle = "rgba(200, 200, 200, 0.5)";
      ctx.fill();
    }

    return canvas;
  }
}
