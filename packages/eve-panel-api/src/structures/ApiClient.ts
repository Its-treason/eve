import { REST } from '@discordjs/rest';
import { APIChannel, APIGuild, APIGuildMember, APIMessage, APIRole, APIUser, Routes } from 'discord-api-types/v9';
import { RedisClientType } from 'redis';
import { RequestData, RouteLike } from '@discordjs/rest/dist/lib/RequestManager';
import { RESTPatchAPIChannelMessageJSONBody, RESTPostAPIChannelMessageJSONBody } from 'discord-api-types/rest/v9/channel';

export class ApiClient {
  private static readonly NULL_VALUE = 'NIL';
  private static readonly CACHE_TTL = 60;

  private readonly restClient: REST;

  constructor(
    token: string,
    private readonly redisClient: RedisClientType,
  ) {
    this.restClient = new REST({ version: '9' }).setToken(token);
  }

  public async getChannel(id: string): Promise<APIChannel|null> {
    const redisKey = `eve-channel-${id}`;

    return await this.cacheExec<APIChannel>(redisKey, 'GET', Routes.channel(id));
  }

  public async getChannels(id: string): Promise<APIChannel[]|null> {
    const redisKey = `eve-channels-${id}`;

    return await this.cacheExec<APIChannel[]>(redisKey, 'GET', Routes.guildChannels(id));
  }

  public async getGuild(id: string): Promise<APIGuild|null> {
    const redisKey = `eve-guild-${id}`;

    return await this.cacheExec<APIGuild>(redisKey, 'GET', Routes.guild(id));
  }

  public async getUser(id: string): Promise<APIUser|null> {
    const redisKey = `eve-user-${id}`;

    return await this.cacheExec<APIUser>(redisKey, 'GET', Routes.user(id));
  }

  public async getGuildMember(guildId: string, userId: string): Promise<APIGuildMember|null> {
    const redisKey = `eve-guild-member-${guildId}-${userId}`;

    return await this.cacheExec<APIGuildMember>(redisKey, 'GET', Routes.guildMember(guildId, userId));
  }

  public async getMessage(channelId: string, messageId: string): Promise<APIMessage|null> {
    const redisKey = `eve-message-${channelId}-${messageId}`;

    return await this.cacheExec<APIMessage>(redisKey, 'GET', Routes.channelMessage(channelId, messageId));
  }

  public async getRoles(guildId: string): Promise<APIRole[]|null> {
    const redisKey = `eve-roles-${guildId}`;

    return await this.cacheExec<APIRole[]>(redisKey, 'GET', Routes.guildRoles(guildId));
  }

  public async getRole(guildId: string, roleId: string): Promise<APIRole|null> {
    const roles = await this.getRoles(guildId);
    if (!roles) {
      return null;
    }

    for (const role of roles) {
      if (role.id === roleId) {
        return role;
      }
    }

    return null;
  }

  public async getBotUser(): Promise<APIUser|null> {
    const redisKey = 'eve-bot-user';

    return await this.cacheExec<APIUser>(redisKey, 'GET', Routes.user('@me'));
  }

  public getUserAvatar(user: APIUser): string {
    return user?.avatar ?
      `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.jpg` :
      `https://cdn.discordapp.com/embed/avatars/${Number(user.discriminator) % 5}.jpg`;
  }

  public getGuildIcon(guild: APIGuild): string {
    return guild.icon ?
      `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.jpg` :
      'https://cdn.discordapp.com/embed/avatars/5.jpg';
  }

  public roleHasPermission(role: APIRole, permission: BigInt): boolean {
    return (Number(role.permissions) & Number(permission)) === Number(permission);
  }

  public async sendMessage(channelId: string, body: RESTPostAPIChannelMessageJSONBody): Promise<APIMessage|null> {
    try {
      return await this.restClient.post(Routes.channelMessages(channelId), { body }) as APIMessage;
    } catch {
      return null;
    }
  }

  public async editMessage(channelId: string, messageId: string, body: RESTPatchAPIChannelMessageJSONBody): Promise<APIMessage> {
    return await this.restClient.patch(Routes.channelMessage(channelId, messageId), { body }) as APIMessage;
  }

  public async deleteMessage(channelId: string, messageId: string): Promise<boolean> {
    return !!await this.restClient.delete(Routes.channelMessage(channelId, messageId));
  }

  private async cacheExec<T>(
    redisKey: string,
    method: 'GET'|'POST'|'PATCH',
    route: RouteLike,
    options?: RequestData,
  ): Promise<T|null> {
    const cachedValue = await this.redisClient.get(redisKey);
    if (cachedValue) {
      if (cachedValue === ApiClient.NULL_VALUE || cachedValue === null) {
        return null;
      }
      return JSON.parse(cachedValue);
    }

    let value;
    try {
      switch (method) {
        case 'GET':
          value = await this.restClient.get(route, options) as T;
          break;
        case 'POST':
          value = await this.restClient.post(route, options) as T;
          break;
        case 'PATCH':
          value = await this.restClient.patch(route, options) as T;
          break;
      }
    } catch (e) {
      await this.redisClient.set(redisKey, ApiClient.NULL_VALUE);
      await this.redisClient.expire(redisKey, ApiClient.CACHE_TTL);
      return null;
    }

    await this.redisClient.set(redisKey, JSON.stringify(value));
    await this.redisClient.expire(redisKey, ApiClient.CACHE_TTL);
    return value;
  }
}
