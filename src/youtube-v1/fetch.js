
const fetch = require('node-fetch')

const { writeJSONFile } = require('../download')

const {
    channelDataModel,
    channelVideosDataModel,
    channelsSearchDataModel,
    videoCommentsDataModel,
    channelVideoModel,
} = require('./lib/data-models')

const request = async (url, options = {}) => {
    const res = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
            ...(options.headers || {}),
        },
    })

    if (res.status !== 200) throw new Error('request failed')

    let json = null
    try {
        json = await res.json()
    } catch (err) {}

    if (!json) throw new Error('data not found')
    return json
}

module.exports.getChannel = async (channelId, options = {}) => {
    if (!options.apiKey) throw new Error('missing options.apiKey')

    const url = [
        'https://www.googleapis.com/youtube/v3/channels',
        `?id=${channelId}`,
        `&part=snippet,statistics,brandingSettings`,
        `&key=${options.apiKey}`
    ].join('')

    const json = await request(url, options)
    if (!json.items.length) return null

    const data = options.withDataModel ? channelDataModel(json.items[0]) : json.items[0]

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

    const json = await request(url, options)
    if (!json.items.length) return []

    const data = options.withDataModel ? channelVideosDataModel(json.items) : json.items

    if (options.downloadFile) {
        writeJSONFile({
            fileName: `youtube-v1-videos-${channelId}`,
            json: data,
        })
    }

    return data
}

module.exports.getVideo = async (videoId, options = {}) => {
    if (!options.apiKey) throw new Error('missing options.apiKey')

    const url = [
        'https://www.googleapis.com/youtube/v3/videos',
        '?part=snippet,statistics',
        `&id=${videoId}`,
        `&key=${options.apiKey}`,
    ].join('')

    const json = await request(url, options)
    if (!json.items.length) return null

    const data = options.withDataModel ? channelVideoModel(json.items[0]) : json.items[0]

    if (options.downloadFile) {
        writeJSONFile({
            fileName: `youtube-v1-video-${videoId}`,
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

    const json = await request(url, options)
    if (!json.items.length) return []

    const data = options.withDataModel ? channelsSearchDataModel(json.items) : json.items

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

    const json = await request(url, options)
    if (!json.items.length) return []

    const data = options.withDataModel ? videoCommentsDataModel(json.items) : json.items

    if (options.downloadFile) {
        writeJSONFile({
            fileName: `youtube-v1-video-comments-${videoId}`,
            json: data,
        })
    }

    return data
}