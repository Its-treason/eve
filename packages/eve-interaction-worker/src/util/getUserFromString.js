'use strict';

const getUserFromMention = require('./getUserFromMention');

module.exports = async (userString, client) => {
  try {
    let user = getUserFromMention(userString, client);

    if (user === null) {
      user = await client.users.fetch(userString);
    }

    return user || null;
  } catch (e) {
    return null;
  }
};
