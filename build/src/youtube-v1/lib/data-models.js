module.exports.channelDataModel = json => ({
  id: json.id,
  username: json.snippet.title,
  bio: json.snippet.description,
  pic: json.snippet.thumbnails.high.url,
  followers: json.statistics.subscriberCount,
  trailer: json.brandingSettings.channel.unsubscribedTrailer || null,
  // video id of the trailer
  keywords: json.brandingSettings.channel.keywords,
  views: json.statistics.viewCount,
  videos: json.statistics.videoCount,
  comments: json.statistics.commentCount,
  published: json.snippet.publishedAt,
  featured: json.brandingSettings.channel.featuredChannelsUrls // banner: json.brandingSettings.image.bannerImageUrl,

});

module.exports.channelVideosDataModel = json => json.map(item => ({
  id: item.id.videoId,
  pic: item.snippet.thumbnails.high ? item.snippet.thumbnails.high.url : item.snippet.thumbnails.default.url,
  title: item.snippet.title,
  description: item.snippet.description,
  channelId: item.snippet.channelId,
  channelName: item.snippet.channelTitle,
  publishedAt: item.snippet.publishedAt
}));

module.exports.channelsSearchDataModel = json => json.map(item => ({
  id: item.snippet.channelId,
  username: item.snippet.channelTitle,
  pic: item.snippet.thumbnails.default.url,
  bio: item.snippet.description,
  published: item.snippet.publishedAt
}));

module.exports.videoCommentsDataModel = json => json.map(i => ({
  username: i.snippet.topLevelComment.snippet.authorDisplayName,
  pic: i.snippet.topLevelComment.snippet.authorProfileImageUrl,
  channelId: i.snippet.topLevelComment.snippet.authorChannelId.value,
  text: i.snippet.topLevelComment.snippet.textOriginal,
  published: i.snippet.topLevelComment.snippet.publishedAt,
  updated: i.snippet.topLevelComment.snippet.updatedAt
}));

module.exports.channelVideoModel = json => {
  const {
    thumbnails
  } = json.snippet;
  const stats = json.statistics;
  return {
    id: json.id,
    title: json.snippet.title,
    description: json.snippet.description,
    pic: thumbnails.standard ? thumbnails.standard.url : thumbnails.high && thumbnails.high.url || thumbnails.medium && thumbnails.medium.url || thumbnails.default && thumbnails.default.url,
    tags: json.snippet.tags,
    views: Number(stats.viewCount),
    likes: Number(stats.likeCount),
    dislikes: Number(stats.dislikeCount),
    comments: Number(stats.commentCount),
    engagement: ((Number(stats.likeCount) + Number(stats.dislikeCount) + Number(stats.commentCount)) / Number(stats.viewCount)).toFixed(2) / 1
  };
};