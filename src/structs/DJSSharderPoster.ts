import { BasePoster, BasePosterInterface } from './BasePoster'

import { BotStats } from '@top-gg/sdk/dist/typings'

import { ShardingManager } from 'discord.js'

import { PosterOptions } from '../typings'

/**
 * Auto-Poster For Discord.JS ShardingManager
 */
export class DJSSharderPoster extends BasePoster implements BasePosterInterface {
  private client: ShardingManager

  /**
   * Create a new poster
   * @param token Top.gg API Token
   * @param client Your Discord.JS ShardingManager
   * @param options Options
   */
  constructor (token: string, client: any, options?: PosterOptions) {
    if (!token) throw new Error('Missing Top.gg Token')
    if (!client) throw new Error('Missing client')

    const Discord = require('discord.js')

    if (!(client instanceof Discord.ShardingManager)) throw new Error('Not a discord.js ShardingManager.')

    super(token, options)

    this.client = client

    this._binder({
      clientReady: () => this.clientReady(),
      waitForReady: (fn) => this.waitForReady(fn),
      getStats: () => this.getStats()
    })
  }

  public clientReady (): boolean {
    return this.client.shards.size > 0 && this.client.shards.every(x => x.ready)
  }

  public waitForReady(fn: () => void) {
    const listener = (shard) => {
      if (shard.id !== (this.client.totalShards as number) - 1) return

      this.client.off('shardCreate', listener)
      shard.once('ready', () => {
        fn()
      })
    }
    this.client.on('shardCreate', listener)
  }

  public async getStats (): Promise<BotStats> {
    const response = await this.client.fetchClientValues('guilds.cache.size') as number[]
    return {
      serverCount: response.reduce((a, b) => a + b, 0),
      shardCount: response.length
    }
  }
}
