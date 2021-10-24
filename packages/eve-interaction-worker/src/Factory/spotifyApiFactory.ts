import SpotifyApi from 'spotify-web-api-node';

export default async function spotifyApiFactory(): Promise<SpotifyApi> {
  const spotifyApi = new SpotifyApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  });

  const updateAccessToken = async () => {
    const data = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(data.body['access_token']);
  };
  await updateAccessToken();

  setInterval(updateAccessToken, 6e+6);

  return spotifyApi;
}
