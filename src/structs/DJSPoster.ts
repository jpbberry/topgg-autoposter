import { BasePoster, BasePosterInterface } from './BasePoster'

/**
 * Auto-Poster For Discord.JS
 */
export default class DJSPoster extends BasePoster implements BasePosterInterface {
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

    if (!(client instanceof Discord.Client)) throw new Error('Not a discord.js client.')

    super(token, options)

    this.client = client

    this._binder({
      clientReady: () => this.clientReady(),
      waitForReady: (fn) => this.waitForReady(fn),
      getStats: () => this.getStats()
    })
  }

  public clientReady (): boolean {
    return this.client.ws.status === 0
  }

  public waitForReady(fn: () => void) {
    this.client.once('ready', () => {
      fn()
    })
  }

  public async getStats (): Promise<BotStats> {
    return {
      serverCount: this.client.guilds.cache.size,
      shardId: this.client.shard?.ids[0],
      shardCount: this.client.options.shardCount || 1
    }
  }
}