import yasha from 'yasha';

export interface MusicResult {
  url: string,
  uploader: string,
  title: string,
  ytId: string,
  requestedBy: string,
  track: yasha.Track.Track,
}
