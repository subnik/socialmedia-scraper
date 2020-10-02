const request = require('superagent');

module.exports.getChannel = async (channelId, options = {}) => {
  if (!options.apiKey) throw new Error('missing options.apiKey');
  const url = ['https://www.googleapis.com/youtube/v3/channels', `?id=${channelId}`, `&part=snippet,statistics,brandingSettings`, `&key=${options.apiKey}`].join('');
  const res = await request.get(url);
  const json = res.body.items;
  if (!json.length) return null;

  if (options.withDataModel) {
    return {
      id: json[0].id,
      username: json[0].snippet.title,
      bio: json[0].snippet.description,
      pic: json[0].snippet.thumbnails.high.url,
      followers: json[0].statistics.subscriberCount,
      trailer: json[0].brandingSettings.channel.unsubscribedTrailer || null,
      // video id of the trailer
      keywords: json[0].brandingSettings.channel.keywords,
      views: json[0].statistics.viewCount,
      videos: json[0].statistics.videoCount,
      comments: json[0].statistics.commentCount,
      published: json[0].snippet.publishedAt,
      featured: json[0].brandingSettings.channel.featuredChannelsUrls,
      banner: json[0].brandingSettings.image.bannerImageUrl
    };
  }

  return json[0];
};

module.exports.getChannelVideos = async (channelId, options = {}) => {
  if (!options.apiKey) throw new Error('missing options.apiKey');
  const url = ['https://www.googleapis.com/youtube/v3/search', `?part=snippet`, `&type=video`, `&channelId=${channelId}`, `&maxResults=${options.limit || 5}`, `&key=${options.apiKey}`].join('');
  const res = await request.get(url);
  const json = res.body.items;
  if (!json.length) return [];

  if (options.withDataModel) {
    return json.map(item => ({
      id: item.id.videoId,
      pic: item.snippet.thumbnails.high ? item.snippet.thumbnails.high.url : item.snippet.thumbnails.default.url,
      title: item.snippet.title,
      description: item.snippet.description,
      channelId: item.snippet.channelId,
      channelName: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt
    }));
  }

  return json;
};

module.exports.searchChannel = async (username, options = {}) => {
  if (!options.apiKey) throw new Error('missing options.apiKey');
  const url = ['https://www.googleapis.com/youtube/v3/search', `?part=snippet`, `&type=channel`, `&q=${username}`, `&maxResults=${options.limit || 5}`, `&key=${options.apiKey}`].join('');
  const res = await request.get(url);
  const json = res.body.items;
  if (!json.length) return [];

  if (options.withDataModel) {
    return res.body.items.map(item => ({
      id: item.snippet.channelId,
      username: item.snippet.channelTitle,
      pic: item.snippet.thumbnails.default.url,
      bio: item.snippet.description,
      published: item.snippet.publishedAt
    }));
  }

  return json;
};

module.exports.getVideoComments = async (videoId, options = {}) => {
  if (!options.apiKey) throw new Error('missing options.apiKey');
  const url = ['https://www.googleapis.com/youtube/v3/commentThreads', '?part=snippet', `&order=${options.order || 'time'}`, `&searchTerms=${encodeURIComponent(options.searchTerm || '')}`, `&videoId=${encodeURIComponent(videoId)}`, `&maxResults=${options.limit || 5}`, `&key=${options.apiKey}`].join('');
  const res = await request.get(url);
  const json = res.body.items;
  if (json.length === 0) return [];

  if (options.withDataModel) {
    return json.map(i => ({
      username: i.snippet.topLevelComment.snippet.authorDisplayName,
      pic: i.snippet.topLevelComment.snippet.authorProfileImageUrl,
      channelId: i.snippet.topLevelComment.snippet.authorChannelId.value,
      text: i.snippet.topLevelComment.snippet.textOriginal,
      published: i.snippet.topLevelComment.snippet.publishedAt,
      updated: i.snippet.topLevelComment.snippet.updatedAt
    }));
  }

  return json;
};