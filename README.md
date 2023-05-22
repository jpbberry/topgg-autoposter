# Top.gg AutoPoster
Easy AutoPosting via the [top.gg sdk](https://npmjs.com/package/@top-gg/sdk)

# How to
It's really really simple! All you gotta do is:
```js
const { AutoPoster } = require('topgg-autoposter')

const poster = AutoPoster('topggtoken', client) // your discord.js or eris client

// optional
poster.on('posted', (stats) => { // ran when succesfully posted
  console.log(`Posted stats to Top.gg | ${stats.serverCount} servers`)
})
```
*You can also do poster.on('error', (err) => { ... }) and this will stop errors from being logged and left for you to handle*

And that's it!

It will begin to post your server count, and shard count every 30 minutes.

This even work on individual Discord.JS shards that are process separated.

If you would like to do specific clients, `DJSPoster` & `ErisPoster` & `DJSSharderPoster` & `RosePoster` are all exported classes!

## Traditional Discord.JS Sharding:

If you use Discord.JS' traditional `ShardingManager` sharder, you can also append the AutoPoster to the sharding manager like so:

```js
const sharder = new Discord.ShardingManager(...)

const poster = AutoPoster('topggtoken', sharder)

sharder.spawn() // rest of your stuff!
```
This will run broadcastEval's and automatically fetch your statistics!

## [Discord-Rose](https://npmjs.com/discord-rose) posting

```js
const master = new Master(...)

const poster = AutoPoster('topggtoken', master)
```
And it will run everything through comms.getStats() function

## [Discord Hybrid Sharding](https://www.npmjs.com/package/discord-hybrid-sharding) Clusters
If you're using Discord.JS alongside Discord Hybrid Sharding, overwrite the getStats function for auto poster.

```js
client.cluster = new ClusterClient(client);

const poster = AutoPoster(topggAPI, client);

poster.getStats = async () => {
  const response = await client.cluster.fetchClientValues('guilds.cache.size');

  return {
    serverCount: response.reduce((a, b) => a + b, 0),
    shardCount: client.cluster.info.TOTAL_SHARDS
  }
}

poster.on("error", (err) => {});
```