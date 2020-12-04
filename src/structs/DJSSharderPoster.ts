import { BasePoster, BasePosterInterface } from './BasePoster'

/**
 * Auto-Poster For Discord.JS
 */
export default class DJSSharderPoster extends BasePoster implements BasePosterInterface {
  private client: any

  /**
   * Create a new poster
   * @param token Top.gg Bot Token
   * @param client Your Discord.JS Client
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
    return this.client.shards.every(x => x.ready)
  }

  public waitForReady(fn: () => void) {
    this.client.shards.last().on('ready', () => {
      fn()
    })
  }

  public async getStats (): Promise<BotStats> {
    const response = await this.client.fetchClientValues('guilds.cache.size')
    return {
      serverCount: response.reduce((a, b) => a + b, 0),
      shardCount: response.length
    }
  }
}