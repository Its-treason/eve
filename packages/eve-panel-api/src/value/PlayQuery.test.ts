import PlayQuery from './PlayQuery';
import { test } from '@jest/globals';

describe('Can create PlayQuery object', () => {
  test('With search query', () => {
    const query = PlayQuery.fromQuery('Search for something');

    expect(query.getType()).toEqual('search');
    expect(query.getQuery()).toEqual('Search for something');
  });

  test('With Youtube-Link query', () => {
    const query = PlayQuery.fromQuery('https://www.youtube.com/watch?v=dQw4w9WgXcQ');

    expect(query.getType()).toEqual('search-id');
    expect(query.getQuery()).toEqual('dQw4w9WgXcQ');
  });

  test('With Youtube-Playlist query', () => {
    const query = PlayQuery.fromQuery('https://www.youtube.com/playlist?list=PLNtRKpqd-QIgI8UJ-qp-HznL378mklvIW');

    expect(query.getType()).toEqual('yt-playlist');
    expect(query.getQuery()).toEqual('PLNtRKpqd-QIgI8UJ-qp-HznL378mklvIW');
  });

  test('With Spotify-Playlist query', () => {
    const query = PlayQuery.fromQuery('https://open.spotify.com/playlist/17cvG95kDwMlt2BUenm1zC?si=d0c736b38d1f4537');

    expect(query.getType()).toEqual('spotify-playlist');
    expect(query.getQuery()).toEqual('17cvG95kDwMlt2BUenm1zC');
  });
});
