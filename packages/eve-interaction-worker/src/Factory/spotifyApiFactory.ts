import SpotifyApi from 'spotify-web-api-node';

export default async function spotifyApiFactory(): Promise<SpotifyApi> {
  const spotifyApi = new SpotifyApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  });

  const data = await spotifyApi.clientCredentialsGrant();
  spotifyApi.setAccessToken(data.body['access_token']);
  return spotifyApi;
}
