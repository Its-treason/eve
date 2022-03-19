import SpotifyApi from 'spotify-web-api-node';

export default function spotifyApiFactory(): SpotifyApi {
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
  updateAccessToken();

  return spotifyApi;
}
