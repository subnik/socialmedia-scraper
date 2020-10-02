
const request = require('superagent')

const { writeJSONFile } = require('../download')

const {
    channelDataModel,
    channelVideosDataModel,
    channelsSearchDataModel,
    videoCommentsDataModel,
} = require('./lib/data-models')

module.exports.getChannel = async (channelId, options = {}) => {
    if (!options.apiKey) throw new Error('missing options.apiKey')

    const url = [
        'https://www.googleapis.com/youtube/v3/channels',
        `?id=${channelId}`,
        `&part=snippet,statistics,brandingSettings`,
        `&key=${options.apiKey}`
    ].join('')

    const res = await request.get(url)
    const json = res.body.items
    if (!json.length) return null

    const data = options.withDataModel ? channelDataModel(json[0]) : json[0]

    if (options.downloadFile) {
        writeJSONFile({
            fileName: `youtube-v1-${channelId}`,
            json: data,
        })
    }

    return data
}

module.exports.getChannelVideos = async (channelId, options = {}) => {
    if (!options.apiKey) throw new Error('missing options.apiKey')

    const url = [
        'https://www.googleapis.com/youtube/v3/search',
        `?part=snippet`,
        `&type=video`,
        `&channelId=${channelId}`,
        `&maxResults=${options.limit || 5}`,
        `&key=${options.apiKey}`,
    ].join('')

    const res = await request.get(url)
    const json = res.body.items
    if (!json.length) return []

    const data = options.withDataModel ? channelVideosDataModel(json) : json

    if (options.downloadFile) {
        writeJSONFile({
            fileName: `youtube-v1-videos-${channelId}`,
            json: data,
        })
    }

    return data
}

module.exports.searchChannel = async (username, options = {}) => {
    if (!options.apiKey) throw new Error('missing options.apiKey')

    const url = [
        'https://www.googleapis.com/youtube/v3/search',
        `?part=snippet`,
        `&type=channel`,
        `&q=${username}`,
        `&maxResults=${options.limit || 5}`,
        `&key=${options.apiKey}`,
    ].join('')

    const res = await request.get(url)
    const json = res.body.items
    if (!json.length) return []

    const data = options.withDataModel ? channelsSearchDataModel(json) : json

    if (options.downloadFile) {
        writeJSONFile({
            fileName: `youtube-v1-search-${username}`,
            json: data,
        })
    }

    return data
}

module.exports.getVideoComments = async (videoId, options = {}) => {
    if (!options.apiKey) throw new Error('missing options.apiKey')

    const url = [
        'https://www.googleapis.com/youtube/v3/commentThreads',
        '?part=snippet',
        `&order=${options.order || 'time'}`,
        `&searchTerms=${encodeURIComponent(options.searchTerm || '')}`,
        `&videoId=${encodeURIComponent(videoId)}`,
        `&maxResults=${options.limit || 5}`,
        `&key=${options.apiKey}`,
    ].join('')

    const res = await request.get(url)
    const json = res.body.items
    if (json.length === 0) return []

    const data = options.withDataModel ? videoCommentsDataModel(json) : json

    if (options.downloadFile) {
        writeJSONFile({
            fileName: `youtube-v1-video-comments-${videoId}`,
            json: data,
        })
    }

    return data
}