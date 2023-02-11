import { ChatInputCommandInteraction } from 'discord.js';
import messageEmbedFactory from '../Factory/messageEmbedFactory';

export default abstract class AbstractValidationHandler {
  protected next?: AbstractValidationHandler;

  public setNext(handler: AbstractValidationHandler): void {
    this.next = handler;
  }

  protected async reply(command: ChatInputCommandInteraction, title: string, msg: string): Promise<void> {
    const embed = messageEmbedFactory(command.client, title);
    embed.setDescription(msg);
    await command.reply({ embeds: [embed], ephemeral: true });
  }

  public abstract handle(command: ChatInputCommandInteraction): void;
}
