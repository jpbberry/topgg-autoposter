const discordToken = process.argv[2]
const topggToken = 'abc' // unnecessary to debug

const path = require('path')

const AutoPoster = require('..')

const DiscordJS = require('discord.js')
const Eris = require('eris')

const shardCount = Math.floor(Math.random() * 3) + 2

let currentRunning = 'ESTABLISH'
let kill

function debug (msg) {
  console.debug(`[TEST] ${currentRunning}: ${msg}`)
}

debug(`Spawning ${shardCount} shards.`)

const runs = {
  'discord.js': () => new Promise(resolve => {
    const client = new DiscordJS.Client({ shardCount })

    client.on('ready', () => {
      debug('Received READY')

      resolve()
    })

    const poster = AutoPoster(topggToken, client)

    client.login(discordToken)
    kill = () => {
      poster.stop()
      client.destroy()
    }
  }),
  'eris': () => new Promise(resolve => {
    const client = new Eris.Client(discordToken, { maxShards: shardCount })

    const poster = AutoPoster(topggToken, client)

    client.on('ready', () => {
      debug('Received READY')

      resolve()
    })

    client.connect()
    kill = () => {
      poster.stop()
      client.disconnect()
    }
  }),
  'discord.js.traditional': () => new Promise(resolve => {
    const sharder = new DiscordJS.ShardingManager('./tests/traditional.js', { token: discordToken, totalShards: shardCount, respawn: false })

    debug('Spawning shards, please wait...')
    sharder.spawn().then(() => {
      debug('Received READY from all shards')
      return true
    }).then(() => resolve())

    kill = () => {
      sharder.shards.forEach(x => x.kill())
    }
  }),
  'discord.js.sharder': () => new Promise(resolve => {
    const sharder = new DiscordJS.ShardingManager('./tests/sharder.js', { token: discordToken, totalShards: shardCount, respawn: false })

    const poster = new AutoPoster(topggToken, sharder)

    debug('Spawning shards, please wait...')
    sharder.spawn().then(() => {
      debug('Received READY from all shards')
    }).then(() => resolve())

    kill = () => {
      sharder.shards.forEach(x => x.kill())
    }
  })
}

const wait = (time) => new Promise(resolve => setTimeout(() => resolve(), time))

async function run () {
  if (process.argv[3]) {
    currentRunning = process.argv[3]
    await runs[currentRunning]()
    await wait(5000)

    return process.exit()
  }
  for (const cur in runs) {
    currentRunning = cur
    debug('Loading')

    await runs[cur]()

    debug('Cleaning up')

    await wait(5000)
    kill()
  }

  process.exit()
}

run()