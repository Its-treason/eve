'use strict';

module.exports = (mention, client) => {
  if (!mention) return null;

  if (mention.startsWith('<@') && mention.endsWith('>')) {
    mention = mention.slice(2, -1);

    if (mention.startsWith('!')) {
      mention = mention.slice(1);
    }

    return client.users.cache.get(mention);
  }

  return null;
};
