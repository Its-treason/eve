// @ts-ignore
import * as SpotifyApi from 'spotify-web-api-node';

let api: SpotifyApi;

export default async function getSpotifyApi(): Promise<SpotifyApi> {
  if (api !== undefined) {
    return api;
  }

  api = new SpotifyApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  });

  const updateAccessToken = async () => {
    const data = await api.clientCredentialsGrant();
    api.setAccessToken(data.body['access_token']);
  };
  await updateAccessToken();

  setInterval(updateAccessToken, 3e+6);

  return api;
}
