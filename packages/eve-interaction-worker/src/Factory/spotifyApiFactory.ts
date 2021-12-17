import SpotifyApi from 'spotify-web-api-node';

export default async function spotifyApiFactory(): Promise<SpotifyApi> {
  const spotifyApi = new SpotifyApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  });

  const updateAccessToken = async () => {
    const data = await spotifyApi.clientCredentialsGrant();
    spotifyApi.resetAccessToken();
    spotifyApi.setAccessToken(data.body['access_token']);

    setTimeout(updateAccessToken, data.body['expires_in'] * 999);
  };
  await updateAccessToken();

  return spotifyApi;
}
