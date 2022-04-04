import { PlaylistItem } from '../../web/sharedApiTypes';
import ytsr from 'ytsr';

export default async function downloadOneByQuery(query: string, requesterId: string): Promise<PlaylistItem|false> {
  const result = await ytsr(query, { limit: 1 });
  const item = result.items[0];

  if (item?.type !== 'video') {
    return false;
  }

  return {
    url: item.url,
    title: item.title,
    uploader: item.author?.name || 'Unknown',
    ytId: item.id,
    requestedBy: requesterId,
  };
}
