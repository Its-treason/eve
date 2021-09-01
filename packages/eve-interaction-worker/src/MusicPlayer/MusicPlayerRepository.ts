import {MusicPlayer} from './MusicPlayer';
import {StageChannel, TextChannel, ThreadChannel, VoiceChannel} from 'discord.js';

export default class MusicPlayerRepository {
  private static musicPlayers = new Map<string, MusicPlayer>();

  public static has(serverId: string): boolean {
    return this.musicPlayers.has(serverId);
  }

  public static get(serverId: string): MusicPlayer {
    return this.musicPlayers.get(serverId);
  }

  public static create(channel: VoiceChannel|StageChannel, textChannel: TextChannel|ThreadChannel): MusicPlayer {
    const player = new MusicPlayer(channel, textChannel);

    this.musicPlayers.set(channel.guild.id, player);

    return player;
  }

  public static async destroy(serverId: string): Promise<boolean> {
    if (!this.musicPlayers.has(serverId)) {
      return false;
    }

    const player = this.musicPlayers.get(serverId);
    await player.destroy();
    this.musicPlayers.delete(serverId);

    return true;
  }
}
