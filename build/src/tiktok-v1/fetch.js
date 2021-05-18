// const scraper = require('tiktok-scraper')
// const { writeJSONFile } = require('../download')
// const { withExTime, arrayRandom, userAgents } = require('./lib')
module.exports.getUser = async (username, options = {}) => {
  throw new Error('deprecated, use tiktok-v2 instead');
  const promise = scraper.getUserProfileInfo(username, {
    userAgent: arrayRandom(options.userAgents || userAgents)
  });
  const data = await (options.withExTime ? withExTime(promise) : promise);

  if (options.downloadFile) {
    writeJSONFile({
      fileName: `tiktok-v1-${username}`,
      json: data
    });
  }

  return data;
};

module.exports.getFeedByUserId = async (userId, options = {}) => {
  throw new Error('deprecated, use tiktok-v2 instead');
  const promise = scraper.user(userId, {
    number: options.limit || 5,
    userAgent: arrayRandom(options.userAgents || userAgents),
    by_user_id: true
  });
  const data = (await (options.withExTime ? withExTime(promise) : promise)).collector;

  if (options.downloadFile) {
    writeJSONFile({
      fileName: `tiktok-v1-feed-${userId}`,
      json: data
    });
  }

  return data;
};

module.exports.getFeedByUsername = async (username, options = {}) => {
  throw new Error('deprecated, use tiktok-v2 instead');
  const promise = scraper.user(username, {
    userAgent: arrayRandom(options.userAgents || userAgents),
    number: options.limit || 5
  });
  const data = (await (options.withExTime ? withExTime(promise) : promise)).collector;

  if (options.downloadFile) {
    writeJSONFile({
      fileName: `tiktok-v1-feed-${username}`,
      json: data
    });
  }

  return data;
};

module.exports.getFeedByTrend = async (options = {}) => {
  throw new Error('deprecated, use tiktok-v2 instead');
  const promise = scraper.trend('', {
    userAgent: arrayRandom(options.userAgents || userAgents),
    number: options.limit || 5
  });
  const data = (await (options.withExTime ? withExTime(promise) : promise)).collector;

  if (options.downloadFile) {
    writeJSONFile({
      fileName: `tiktok-v1-feed-trending`,
      json: data
    });
  }

  return data;
};