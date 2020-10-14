const fetch = require('node-fetch');

const validateProfile = require('./lib/profile-validate-json');

const validateProfileMedia = require('./lib/profile-validate-media-json');

const createProfileDataModel = require('./lib/profile-create-data-model');

const validatePost = require('./lib/post-validate-json');

const createPostDataModel = require('./lib/post-create-data-model');

const {
  writeJSONFile
} = require('../download');

const headers = {
  "Accept-Language": "en-us",
  'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  "Accept-Encoding": "gzip, deflate, br",
  Referer: 'https://www.google.com/'
};
const userAgents = ["Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3738.0 Safari/537.36", "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/79.0.3945.88 Safari/537.36", "Mozilla/5.0 (iPhone; CPU iPhone OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 123.1.0.26.115 (iPhone11,8; iOS 13_3; en_US; en-US; scale=2.00; 828x1792; 190542906)", "Mozilla/5.0 (Linux; Android 8.1.0; motorola one Build/OPKS28.63-18-3; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/70.0.3538.80 Mobile Safari/537.36 Instagram 72.0.0.21.98 Android (27/8.1.0; 320dpi; 720x1362; motorola; motorola one; deen_sprout; qcom; pt_BR; 132081645)"];

module.exports.getProfile = async (username, options = {}) => {
  const igUrl = `https://www.instagram.com/${username}?__a=1`;
  const url = options.setUrl ? options.setUrl(igUrl) : igUrl;
  const res = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: { ...headers,
      'User-Agent': options.userAgent || userAgents[Math.floor(Math.random() * userAgents.length)],
      ...(options.headers || {})
    }
  });

  if (res.status !== 200) {
    if (res.status === 404) throw new Error('notfound');
    if (res.status === 401) throw new Error('unauthorized');
    if (res.status === 403) throw new Error('forbidden');
    if (res.status === 429) throw new Error('blocked');
    throw new Error('request failed');
  }

  let json = null;

  try {
    json = await res.json();
  } catch (err) {}

  if (!json) throw new Error('notfound'); // find if got block by bot

  if (res.redirects) {
    const gotBlocked = res.redirects.some(i => i.indexOf('login') !== -1);
    if (gotBlocked) throw new Error('blocked');
  }

  if (options.validateJson) {
    const validator = validateProfile(json);
    if (validator.errors.length) throw new Error(validator.errors[0]);
    const media = json.graphql.user.edge_owner_to_timeline_media.edges;

    if (media.length) {
      const validator2 = validateProfileMedia(media[0]);
      if (validator2.errors.length) throw new Error(validator2.errors[0]);
    }
  }

  const data = options.withDataModel ? createProfileDataModel(json) : json;

  if (options.downloadFile) {
    writeJSONFile({
      fileName: `instagram-v1-${username}`,
      json: data
    });
  }

  return data;
};

module.exports.getPost = async (postCode, options = {}) => {
  const igUrl = `https://www.instagram.com/p/${postCode}?__a=1`;
  const url = options.setUrl ? options.setUrl(igUrl) : igUrl;
  const res = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'User-Agent': options.userAgent || userAgents[Math.floor(Math.random() * userAgents.length)],
      ...(options.headers || {})
    }
  });

  if (res.status !== 200) {
    if (res.status === 404) throw new Error('notfound');
    if (res.status === 401) throw new Error('unauthorized');
    if (res.status === 403) throw new Error('forbidden');
    if (res.status === 429) throw new Error('blocked');
    throw new Error('failed');
  }

  let json = null;

  try {
    json = await res.json();
  } catch (err) {}

  if (!json) throw new Error('notfound');

  if (options.validateJson) {
    const validator = validatePost(json);

    if (validator.errors.length) {
      throw new Error(validator.errors[0]);
    }
  }

  const data = options.withDataModel ? createPostDataModel(json) : json;

  if (options.downloadFile) {
    writeJSONFile({
      fileName: `instagram-v1-${postCode}`,
      json: data
    });
  }

  return data;
};