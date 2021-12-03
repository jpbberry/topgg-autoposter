import { BasePoster, BasePosterInterface } from './BasePoster'

import { BotStats } from '@top-gg/sdk/dist/typings'

import { Client } from 'eris'

import { PosterOptions } from '../typings'

/**
 * Auto-Poster For Eris
 */
export class ErisPoster extends BasePoster implements BasePosterInterface {
  private client: Client

  /**
   * Create a new poster
   * @param token Top.gg API Token
   * @param client Your Eris Client
   * @param options Options
   */
  constructor (token: string, client: any, options?: PosterOptions) {
    if (!token) throw new Error('Missing Top.gg Token')
    if (!client) throw new Error('Missing client')

    const Discord = require('eris')

    if (!(client instanceof Discord.Client)) throw new Error('Not an eris client.')

    super(token, options)

    this.client = client

    this._binder({
      clientReady: () => this.clientReady(),
      waitForReady: (fn) => this.waitForReady(fn),
      getStats: () => this.getStats()
    })
  }

  public clientReady (): boolean {
    return this.client.ready
  }

  public waitForReady(fn: () => void) {
    this.client.once('ready', () => {
      fn()
    })
  }

  public async getStats (): Promise<BotStats> {
    return {
      serverCount: this.client.guilds.size,
      shardCount: this.client.options.maxShards as number
    }
  }
}
