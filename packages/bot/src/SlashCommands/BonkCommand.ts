import { ApplicationCommandData, ApplicationCommandOptionType, ApplicationCommandType, ChatInputCommandInteraction, CommandInteraction, User } from 'discord.js';
import SlashCommandInterface from './SlashCommandInterface';
import { injectable } from 'tsyringe';
import { createCanvas, loadImage, CanvasRenderingContext2D } from 'canvas';
import { Logger } from '@eve/core';

@injectable()
export default class BonkCommand implements SlashCommandInterface {
  getData(): ApplicationCommandData {
    return {
      name: 'bonk',
      description: 'Send a image of the "Go to Horny Jail" meme with users Avatars',
      type: ApplicationCommandType.ChatInput,
      options: [
        {
          name: 'bonkee',
          description: 'User to Bonk',
          type: ApplicationCommandOptionType.User,
          required: false,
        },
        {
          name: 'bonker',
          description: 'User thats Bonks',
          type: ApplicationCommandOptionType.User,
          required: false,
        },
        {
          name: 'title',
          description: 'A title for the image',
          type: ApplicationCommandOptionType.String,
          required: false,
        },
      ],
    };
  }

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const bonkee = interaction.options.getUser('bonkee', false);
    const bonker = interaction.options.getUser('bonker', false);
    const title = interaction.options.getString('title', false);

    // Generating the image takes a few seconds, so we need to defer the reply
    await interaction.deferReply();

    // If we have a title every must be offset a little down
    let titleOffset = 0;
    if (title) {
      titleOffset = 40;
    }

    const canvas = createCanvas(720, 492 + titleOffset);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 720, 492 + titleOffset);

    const bonkImage = await loadImage('https://i.imgflip.com/4aylx8.jpg');
    ctx.drawImage(bonkImage, 0, 0 + titleOffset, 720, 492);

    if (bonker) {
      const bonkerAvatar = bonker.displayAvatarURL({ extension: 'jpeg', size: 256 });
      const bonkerImage = await loadImage(bonkerAvatar);
      ctx.drawImage(bonkerImage, 150, 80 + titleOffset, 150, 150);
    }

    if (bonkee) {
      const bonkeeAvatar = bonkee.displayAvatarURL({ extension: 'jpeg', size: 256 });
      const bonkerImage = await loadImage(bonkeeAvatar);
      ctx.drawImage(bonkerImage, 470, 250 + titleOffset, 150, 150);
    }

    if (title) {
      ctx.font = '50px Impact';
      ctx.fillStyle = '#000000';
      ctx.textAlign = 'center';

      const titleAsLines = this.splitLongText(ctx, title, 700);

      let lineBreakOffset = 0;
      for (const line of titleAsLines) {
        ctx.fillText(line, 720 / 2, 45 + lineBreakOffset, 700);
        lineBreakOffset += 45;
      }
    }

    const attachment = canvas.toBuffer();
    await interaction.editReply({ files: [attachment] });
  }

  private splitLongText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
    var words = text.split(" ");
    var lines = [];
    var currentLine = words[0];

    for (var i = 1; i < words.length; i++) {
        var word = words[i];
        var width = ctx.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
  }
}
