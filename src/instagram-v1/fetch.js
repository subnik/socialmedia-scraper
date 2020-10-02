
const request = require('superagent')

const validateProfile = require('./lib/profile-validate-json')
const validateProfileMedia = require('./lib/profile-validate-media-json')
const createProfileDataModel = require('./lib/profile-create-data-model')

const validatePost = require('./lib/post-validate-json')
const createPostDataModel = require('./lib/post-create-data-model')

const { writeJSONFile } = require('../download')

module.exports.getProfile = async (username, options = {}) => {
    try {
        const igUrl = `https://www.instagram.com/${username}?__a=1`
        const url = options.setUrl ? options.setUrl(igUrl) : igUrl

        const res = await request.get(url)

        // find if got block by bot
        const gotBlocked = res.redirects.some(i => i.indexOf('login') !== -1)
        if (gotBlocked) throw new Error('blocked')
        
        const json = res.body
    
        if (options.validateJson) {
            const validator = validateProfile(json)
            if (validator.errors.length) throw new Error(validator.errors[0])

            const media = json.graphql.user.edge_owner_to_timeline_media.edges
            if (media.length) {
                const validator2 = validateProfileMedia(media[0])
                if (validator2.errors.length) throw new Error(validator2.errors[0])
            }
        }

        const data = options.withDataModel ? createProfileDataModel(json) : json
        if (options.downloadFile) {
            writeJSONFile({
                fileName: `instagram-v1-${username}`,
                json: data,
            })
        }

        return data
    } catch (err) {
        if (err.response) {
            if (err.response.notFound) throw new Error('profile not found')
            if (err.response.unauthorized) throw new Error('unauthorized')
            if (err.response.forbidden) throw new Error('forbidden')
        }

        throw err
    }
}

module.exports.getPost = async (postCode, options = {}) => {
    const igUrl = `https://www.instagram.com/p/${postCode}?__a=1`
    const url = options.setUrl ? options.setUrl(igUrl) : igUrl

    const res = await request.get(url)
    const json = res.body

    if (options.validateJson) {
        const validator = validatePost(json)

        if (validator.errors.length) {
            throw new Error(validator.errors[0])
        }
    }

    const data = options.withDataModel ? createPostDataModel(json) : json
    if (options.downloadFile) {
        writeJSONFile({
            fileName: `instagram-v1-${postCode}`,
            json: data,
        })
    }

    return data
}