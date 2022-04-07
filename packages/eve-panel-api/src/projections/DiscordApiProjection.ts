import fetch from 'node-fetch';
import getLogger from '../structures/getLogger';
import { APIGuild, APIUser } from 'discord-api-types/v9';

interface DiscordTokenResponse {
  'access_token': string,
  'token_type': string,
  'expires_in': number,
  'refresh_token': string,
  scope: string,
}

export default class DiscordApiProjection {
  static async getUserInfo(tokenType: string, accessToken: string): Promise<APIUser|never> {
    const userResult = await fetch('https://discord.com/api/users/@me', {
      headers: {
        authorization: `${tokenType} ${accessToken}`,
      },
    });
    const jsonResult = JSON.parse((await (await userResult.blob()).text()));

    if (typeof jsonResult?.id !== 'string') {
      getLogger().warning('Error in Discord Api Response', jsonResult);
      throw new Error('Invalid Api Response!');
    }

    return jsonResult;
  }

  static async getUsersGuilds(tokenType: string, accessToken: string): Promise<APIGuild[]|null> {
    const guildsResult = await fetch('https://discord.com/api/v9/users/@me/guilds', {
      method: 'GET',
      headers: {
        authorization: `${tokenType} ${accessToken}`,
      },
    });
    const jsonResult = await guildsResult.json();

    if (typeof jsonResult?.message === 'string') {
      getLogger().warning('Error in Discord Api Response', jsonResult);
      return null;
    }

    return jsonResult;
  }

  static async exchangeCodeForToken(code: string): Promise<DiscordTokenResponse|never> {
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;
    const redirectUri = process.env.REDIRECT_URI;

    if (clientId === undefined || clientSecret === undefined || redirectUri === undefined) {
      throw new Error('Environment variables are undefined');
    }

    const response = await fetch('https://discord.com/api/v8/oauth2/token', {
      method: 'POST',
      body: new URLSearchParams({
        'client_id': clientId,
        'client_secret': clientSecret,
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': redirectUri,
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    const res = await response.json();

    if (res.error) {
      throw new Error(res.error_description);
    }

    return res;
  }
}
