
[Open in NPM](https://www.npmjs.com/package/@subnik/socialmedia-scraper)

## Install module

```bash
    yarn add @subnik/socialmedia-scraper 

    or

    npm i @subnik/socialmedia-scraper
```

## Tiktok scraper v1

Using tiktok public api

```js
const { tiktokV1 } = require('@subnik/socialmedia-scraper')

cons options = {
    // a list of user agents that will be rotated,
    // if not assigned it will use default user agents
    userAgents: null,

    // used with feed related calls to fetch a specific amount of videos
    limit: 5,

    // allow to download json response
    // will be stored at at your root directory, folder name "scraper-downloads"
    downloadFile: false,
}

// method 1 - get user profile
const res1 = await tiktokV1.getUser('lelepons', options)

// method 2 - get user videos by userId
const res2 = await tiktokV1.getFeedByUserId('186992876663578624', options)

// method 3 - get user videos by username
const res3 = await tiktokV1.getFeedByUsername('lelepons', options)

// method 4 - get trending videos
const res4 = await tiktokV1.getFeedByTrend(options)
```

## Instagram scraper v1

Using instagram public api

```js
const { instagramV1 } = require('@subnik/socialmedia-scraper')

cons options = {
    // if you dont want us the already implemented url you can construct your own
    // or wrap it with a proxy like http://api.scraperapi.com/?api_key=${apiKey}&url=${url} 
    setUrl: (url) => url,

    // allow to check if the data structure in the reponse is what we expect
    validateJson: false,

    // get a more beautiful json response
    withDataModel: false,

     // allow to download json response
    // will be stored at at your root directory, folder name "scraper-downloads"
    downloadFile: false,

    // @TODO: we may want to assign user agents here too
}

// method 1 - get user profile
const res1 = await instagramV1.getProfile('lelepons', options)

// method 2 - get post data
const res2 = await instagramV1.getPost('CFuqxINhoRz', options)
```

## Youtube scraper v1

Using youtube data api. Read more about (YOUTUBE DATA API Documentation)['https://developers.google.com/youtube/v3/getting-started']

NOTE: requires `apiKey` from your google console

```js
const { youtubeV1 } = require('@subnik/socialmedia-scraper')

cons options = {
    // required property to be able to call youtube apis
    apiKey: '',

    // get a more beautiful json response
    withDataModel: false,

    // used when fetching different kind of lists
    // limit how many elements we want to fetch
    // this is allowed in all methods expect getChannel
    limit: 5,

     // allow to download json response
    // will be stored at at your root directory, folder name "scraper-downloads"
    downloadFile: false,

    /* below are method only used in getVideoComments */

    // you can order response based on 'time' or 'relevance'
    order: 'time',

    // text to search for in a comment
    searchTerm: ''
}

// method 1 - get basic channel data
const res1 = await youtubeV1.getChannel('UC1KmNKYC1l0stjctkGswl6g', options)

// method 2 - get basic channel videos
const res2 = await youtubeV1.getChannelVideos('UC1KmNKYC1l0stjctkGswl6g', options)

// method 3 - search channel by name
const res3 = await youtubeV1.searchChannel('pewdiepie', options)

// method 4 - get video comments
const res4 = await youtubeV1.getVideoComments('pSOOt4-40gU', options)
```