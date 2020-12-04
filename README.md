# Top.gg AutoPoster
Easy AutoPosting via the [top.gg sdk](https://npmjs.com/package/@top-gg/sdk)

# How to
It's really really simple! All you gotta do is:
```js
const AutoPoster = require('topgg-autoposter')

const ap = AutoPoster('topggtoken', client) // your discord.js or eris client

// optional
ap.on('posted', () => { // ran when succesfully posted
  console.log('Posted stats to top.gg')
})
```
And that's it!

It will begin to post your server count, and shard count every 30 minutes.

This even work on individual Discord.JS shards that are process separated.

If you would like to do specific clients, `AutoPoster.DJSPoster` & `AutoPoster.ErisPoster` & `AutoPoster.DJSSharderPoster` with the same parameters!

## Traditional Discord.JS Sharding:

If you use Discord.JS' traditional `ShardingManager` sharder, you can also append the AutoPoster to the sharding manager like so:

```js
const sharder = new Discord.ShardingManager(...)

const poster = AutoPoster('topggtoken', sharder)

sharder.spawn() // rest of your stuff!
```
This will run broadcastEval's and automatically fetch your statistics!