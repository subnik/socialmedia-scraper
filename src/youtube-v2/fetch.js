
const fetch = require('node-fetch')
const cheerio = require('cheerio')

const getJSONFromHTML = async (html) => {
    const $ = await cheerio.load(html)

    const scripts = $('script')
    let data = null
    await Promise.all(Object.keys($('script')).map((i, idx) => {
        if (!scripts[i] || !scripts[i].children || !scripts[i].children.length) return

        const child = scripts[i].children[0] || {}
        if (!child.data) return
        if (child.data.indexOf('var ytInitialData') === -1) return
        data = child.data
    }))

    data = data.replace('var ytInitialData = ', '')
    data = data.substring(0, data.length - 1)
    data = JSON.parse(data)
    return {
        data,
        $,
    }
}

module.exports.searchChannel = async (q, options = {}) => {
    const filter = 'EgIQAg%253D%253D' // channels filter
    const res = await fetch([
        'https://www.youtube.com/results',
        `?search_query=${q}`,
        `&sp=${filter}`
    ].join(''), {
        method: 'GET',
        credentials: 'include',
        headers: {
            ...(options.headers || {}),
        },
    })

    let json = null
    let extract = null
    try {
        extract = await getJSONFromHTML(await res.text())
        json = extract.data
    } catch (err) {
        throw new Error('error extracting json from html')
    }

    let list = null
    try {
        list = json
            .contents
            .twoColumnSearchResultsRenderer
            .primaryContents
            .sectionListRenderer
            .contents[0]
            .itemSectionRenderer
            .contents
            .map(i => {
                if (!i || !i.channelRenderer) return null
                const { channelId, title, thumbnail, subscriberCountText } = i.channelRenderer
                return {
                    id: channelId,
                    username: title.simpleText,
                    pic: (thumbnail && `https:${thumbnail.thumbnails[thumbnail.thumbnails.length - 1].url}`) || null,
                    followers: ((subscriberCountText && subscriberCountText.simpleText) || '0'),
                }
            })
            .filter(i => i !== null)
    } catch (err) {
        throw new Error('error constructing data')
    }

    return list
}

module.exports.getChannelVideos = async (channelId, options = {}) => {
    const res = await fetch(`https://www.youtube.com/channel/${channelId}/videos`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            ...(options.headers || {}),
        },
    })

    let json = null
    let extract = null
    try {
        extract = await getJSONFromHTML(await res.text())
        json = extract.data
    } catch (err) {
        throw new Error('error extracting json from html')
    }

    let list = null
    try {
        list = json
            .contents
            .twoColumnBrowseResultsRenderer
            .tabs[1]
            .tabRenderer
            .content
            .sectionListRenderer
            .contents[0]
            .itemSectionRenderer
            .contents[0]
            .gridRenderer
            .items
            .map(i => i && i.gridVideoRenderer && i.gridVideoRenderer.publishedTimeText ? i.gridVideoRenderer.videoId : null)
            .filter(i => i !== null)
            
    } catch (err) {
        throw new Error('error constructing data')
    }

    return list
}

module.exports.getVideoData = async (videoId, options = {}) => {
    const res = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            ...(options.headers || {}),
        },
    })

    let json = null
    let extract = null
    try {
        extract = await getJSONFromHTML(await res.text())
        json = extract.data
    } catch (err) {
        throw new Error('error extracting json from html')
    }

    let data = null
    try {
        const path = json.contents.twoColumnWatchNextResults.results.results.contents[0].videoPrimaryInfoRenderer
        data = {
            id: videoId,
            url: `https://www.youtube.com/watch?v=${videoId}`,
            pic: extract.$('meta[property="og:image"]').attr('content'),
            description: extract.$('meta[property="og:description"]').attr('content'),
            title: path.title.runs[0].text,
            views: Number(path.viewCount.videoViewCountRenderer.viewCount.simpleText.replace(/[^0-9]/g, '')),
            likes: Number(path.sentimentBar.sentimentBarRenderer.tooltip.replace(' ', '').split('/')[0].replace(/[^0-9]/g, '')),
            dislikes: Number(path.sentimentBar.sentimentBarRenderer.tooltip.replace(' ', '').split('/')[1].replace(/[^0-9]/g, '')),
            published: path.dateText.simpleText,
        }
    } catch (err) {
        throw new Error('error constructing data')
    }

    return data
}