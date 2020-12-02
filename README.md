# Top.gg AutoPoster
Easy AutoPosting via the [top.gg sdk](https://npmjs.com/package/@top-gg/sdk)

# How to
It's really really simple! All you gotta do is:
```js
const AutoPoster = require('topgg-autoposter')

const ap = new AutoPoster('topggtoken', client) // your discord.js or eris client
```
And that's it!

It will begin to post your server count, and shard count every 30 minutes.

This even work on individual Discord.JS shards that are process separated.

If you would like to do specific clients, `AutoPoster.DJSPoster` & `AutoPoster.ErisPoster` with the same parameters!