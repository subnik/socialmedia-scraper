
const scraper = require('tiktok-scraper')

const { withExTime, arrayRandom, userAgents } = require('./lib')

module.exports.getUser = async (username, options = {}) => {
    const promise = scraper.getUserProfileInfo(username, {
        userAgent: arrayRandom(options.userAgents || userAgents),
    })

    const data = await (options.withExTime ? withExTime(promise) : promise)
    return data
}

module.exports.getFeedByUserId = async (userId, options = {}) => {
    const promise = scraper.user(userId, {
        number: options.limit || 5,
        userAgent: arrayRandom(options.userAgents || userAgents),
        by_user_id: true,
    })

    const data = await (options.withExTime ? withExTime(promise) : promise)
    return data.collector
}

module.exports.getFeedByUsername = async (username, options = {}) => {
    const promise = scraper.user(username, {
        userAgent: arrayRandom(options.userAgents || userAgents),
        number: options.limit || 5,
    })
    
    const data = await (options.withExTime ? withExTime(promise) : promise)
    return data.collector
}

module.exports.getFeedByTrend = async (options = {}) => {
    const promise = scraper.trend('', {
        userAgent: arrayRandom(options.userAgents || userAgents),
        number: options.limit || 5,
    })
    
    const data = await (options.withExTime ? withExTime(promise) : promise)
    return data.collector
}
