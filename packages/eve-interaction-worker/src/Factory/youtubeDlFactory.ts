// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import YoutubeDlWrap from 'youtube-dl-wrap';

export default function youtubeDlFactory(): YoutubeDlWrap {
  return new YoutubeDlWrap('/usr/bin/youtube-dl');
}
