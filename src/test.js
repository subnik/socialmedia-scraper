
/* this is only used for testing purposes */

const { runHookApp } = require('@forrestjs/hooks')

const features = [
    // [ '$INIT_SERVICE', async () => {
    //     await require('./download/file').init()
    // }],
    [ '$FINISH', async ({ getEnv }) => {

        // const file = await require('./download/file').writeJSONFile({
        //     json: { foo: '1' },
        //     fileName: 'foo',
        // })
        // throw new Error('fooo')
        // const r = await require('./tiktok-v1').getUser('memusti')
        // console.log(r)
        // const r2 = await require('./tiktok-v1').getFeedByUsername('memusti', { limit: 2 })
        // console.log(r2)

        // const r = await require('./instagram-v1').getProfile('mustafaalfredjiasdasdasd', {
        //     withDataModel: true,
        //     downloadFile: true,
        // })
        // console.log(r)

        // const r2 = await require('./instagram-v1').getPost('Bzqea9qCv6k', {
        //     validateJson: true,
        //     withDataModel: true,
        //     downloadFile: true,
        // })
        // console.log(r2)

        // const r = await require('./youtube-v1/fetch').getChannel('UC1KmNKYC1l0stjctkGswl6g', {
        //     apiKey: getEnv('YOUTUBE_API_KEY'),
        //     withDataModel: true,
        // })
        // console.log(r)

        // console.log(r)

        // const r = await require('./youtube-v1/fetch').getChannelVideos('UC1KmNKYC1l0stjctkGswl6g', {
        //     apiKey: getEnv('YOUTUBE_API_KEY'),
        //     downloadFile: true,
        // })

        // console.log(r)

        // const r = await require('./youtube-v1/fetch').searchChannel('leleponse', {
        //     apiKey: getEnv('YOUTUBE_API_KEY'),
        //     downloadFile: true,
        // })

        // console.log(r)

        // const r = await require('./youtube-v1/fetch').getVideoComments('MtimAuhyP-M', {
        //     apiKey: getEnv('YOUTUBE_API_KEY'),
        //     withDataModel: true,
        //     downloadFile: true,
        // })
        // console.log(r)
        // const r2 = await require('./tiktok-v1').getFeedByUsername('memusti', { limit: 2, downloadFile: true })
        // const r2 = await require('./tiktok-v1').getFeedByUserId(186992876663578624, { limit: 2 })
        // console.log(r2)
        // console.log('fooo')
        // console.log(r)

        // const r = await require('./youtube-v1').getVideo('artTKcYwRpg', {
        //     apiKey: getEnv('YOUTUBE_API_KEY'),
        //     withDataModel: true,
        // })

        // console.log(JSON.stringify(r))

        // let videosData = []
        // const videos = await require('./youtube-v2').getChannelVideos('UC-lHJZR3Gqxm24_Vd_AJ5Yw')
        // console.log(videos)

        // const r = await require('./youtube-v2').searchChannel('lelepons', {
        //     headers: {
        //         'Accept-Language': 'en',
        //     },
        // })
        // console.log(r)

        // await Promise.all(videos.map(async i => {
        //     const r = await require('./youtube-v2').getVideoData(i)
        //     videosData.push(r)
        // }))

        // console.log(videosData)

        // const r = await require('./tiktok-v2').getUser('memusti', {
        //     withDataModel: true,
        // })
        // console.log(r)

        // const r = await require('./tiktok-v2').getUserWithVideosLimit('MS4wLjABAAAA9gTcRquaicfp4drx_aiX7foihZibU1wBk2J099l4JJtnqKySvKEW7ww6Ou7dquDa', {
        //     withDataModel: true,
        // })
        // console.log(r)
    }]
]

runHookApp({
    trace: true,
    services: [
        require('@forrestjs/service-env'),
        require('@forrestjs/service-logger'),
    ],
    features,
    settings: ({ setConfig, getEnv, getConfig }) => {},
})
    .catch((err) => {
        console.log('*** BOOT: Fatal Error')
        console.log(err)
    })
