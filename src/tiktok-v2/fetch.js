
const fetch = require('node-fetch')
const Signer = require('./signature')
const { writeJSONFile } = require('../download')
const { withExTime, arrayRandom, userAgents } = require('./lib')

const createUserDataModel = (data) => {
    if (!data || !data.props.pageProps || data.props.pageProps.serverCode !== 200) {
        if (data.props.pageProps.serverCode === 404) throw new Error('notfound') 
        throw new Error(`failed create data model: code ${data.props.pageProps.serverCode}`)
    }

    const { pageProps } = data.props
    const { userInfo, items } = pageProps

    return {
        id: userInfo.user.id,
        username: userInfo.user.uniqueId,
        name: userInfo.user.nickname,
        pic: userInfo.user.avatarLarger,
        bio: userInfo.user.signature,
        verified: userInfo.user.verified,
        private: userInfo.user.privateAccount,
        secUid: userInfo.user.secUid, // important to store for fetching posts
        followers: userInfo.stats.followerCount,
        followings: userInfo.stats.followingCount,
        likes: userInfo.stats.heartCount,
        posts: userInfo.stats.videoCount,
        postsList: !items || !items.length ? [] : items.map(i => ({
            id: i.id,
            text: i.desc,
            ctime: i.createTime * 1000,
            likes: i.stats.diggCount,
            shares: i.stats.shareCount,
            comments: i.stats.commentCount,
            views: i.stats.playCount,
            pic: i.video.cover,
            dynamicUrl: i.video.dynamicCover,
            videoUrl: i.video.playAddr,
            width: i.video.width,
            height: i.video.height,
            ratio: i.video.ratio,
        })),
    }
}

const createUserVideosDataModel = (data) => {
    if (data.statusCode === undefined || data.statusCode > 0) {
        throw new Error('notfound')
    }

    if (!data.itemList || !data.itemList.length) return {}

    // find author info from first item
    const firstItem = data.itemList[0]

    return {
        id: firstItem.author.id,
        username: firstItem.author.uniqueId,
        name: firstItem.author.nickname,
        pic: firstItem.author.avatarLarger,
        bio: firstItem.author.signature,
        verified: firstItem.author.verified,
        private: firstItem.author.privateAccount,
        secUid: firstItem.author.secUid, // important to store for fetching posts
        followers: firstItem.authorStats.followerCount,
        followings: firstItem.authorStats.followingCount,
        likes: firstItem.authorStats.heartCount,
        posts: firstItem.authorStats.videoCount,
        postsList: data.itemList.map(i => ({
            id: i.id,
            text: i.desc,
            ctime: i.createTime * 1000,
            likes: i.stats.diggCount,
            shares: i.stats.shareCount,
            comments: i.stats.commentCount,
            views: i.stats.playCount,
            pic: i.video.cover,
            dynamicUrl: i.video.dynamicCover,
            videoUrl: i.video.playAddr,
            width: i.video.width,
            height: i.video.height,
            ratio: i.video.ratio,
        }))
    }
}

module.exports.getUserWithVideosLimit = async (secUid, options = {}) => {
    const promise = new Promise(async (resolve, reject) => {
        try {
            const qs = {
                aid: 1988,
                count: options.limit || 12,
                secUid,
                cursor: 0,
            }
        
            const url = `https://www.tiktok.com/api/post/item_list/?${new URLSearchParams(qs).toString()}`
            
            const signer = new Signer(null, arrayRandom(options.userAgents || userAgents)) // Create new signer
            await signer.init() // Create page with. Returns promise
            const signature = await signer.sign(url) // Get sign for your url. Returns promise
            const navigator = await signer.navigator() // Retrieve navigator data used when signature was generated
            await signer.close() // Close browser. Returns promise

            const res = await fetch(signature.signed_url, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    referer: 'https://www.tiktok.com/',
                    'user-agent': navigator.user_agent,
                    ...(options.headers || {}),
                },
            })
            
            const headers = res.headers
            const json = await res.json()

            resolve({
                data: json,
                headers,
            })
        } catch (err) {
            reject('could not parse html')
        }
    })

    const result = await (options.withExTime ? withExTime(promise) : promise)
    const data = options.withDataModel ? createUserVideosDataModel(result.data) : result.data
    
    if (options.downloadFile) {
        writeJSONFile({
            fileName: `tiktok-v2-feed-${secUid}`,
            json: data,
        })
    }

    return {
        headers: result.headers,
        data,
    }
} 

module.exports.getUser = async (username, options = {}) => {
    const promise = new Promise(async (resolve, reject) => {
        try {
            const url = `http://www.tiktok.com/@${username}`
            
            const result = await fetch(url, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    referer: 'https://www.tiktok.com/',
                    'user-agent': arrayRandom(options.userAgents || userAgents),
                    ...(options.headers || {}),
                },
            })
            
            const headers = result.headers
            const text = await result.text()

            const data = text
                .split(/<script id="__NEXT_DATA__" type="application\/json" nonce="[\w-]+" crossorigin="anonymous">/)[1]
                .split(`</script>`)[0]

            resolve({
                data: JSON.parse(data),
                headers,
            })
        } catch (err) {
            reject('could not parse html')
        }
    })

    const result = await (options.withExTime ? withExTime(promise) : promise)
    const data = options.withDataModel ? createUserDataModel(result.data) : result.data
    
    if (options.downloadFile) {
        writeJSONFile({
            fileName: `tiktok-v2-${username}`,
            json: data,
        })
    }

    return {
        headers: result.headers,
        data,
    }
}

