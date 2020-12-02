import { Api } from '@top-gg/sdk'
import { EventEmitter } from 'events'

export default interface DJSPoster {
  on(event: 'posted', listener: (stats) => void)
}

/**
 * Auto-Poster For Discord.JS
 */
export default class DJSPoster extends EventEmitter {
  private client: any
  private api: Api
  public options: PosterOptions

  /**
   * Create a new poster
   * @param token Top.gg Bot Token
   * @param client Your Discord.JS Client
   * @param options Options
   */
  constructor (token: string, client: any, options?: PosterOptions) {
    super()
    if (!token) throw new Error('Missing Top.gg Token')
    if (!client) throw new Error('Missing client')

    const Discord = require('discord.js')

    if (!(client instanceof Discord.Client)) throw new Error('Not a discord.js client.')

    if (!options) options = {}

    this.options = {
      interval: options.interval || 1800000
    }

    if (this.options.interval < 900000) {
      throw new Error('Posting interval must be above 900000 (15 minutes)')
    }

    this.client = client
    this.api = new Api(token)

    if (this.started) this._setupInterval()
    else this.client.once('ready', () => {
      this._setupInterval()
    })
  }

  get started () {
    return this.client.ws.status === 0
  }

  private _setupInterval () {
    this.post()
    setInterval(() => {
      if (!this.started) return
      this.post()
    }, this.options.interval)
  }
  
  public post () {
    this.api.postStats({
      serverCount: this.client.guilds.cache.size,
      shardId: this.client.shard?.ids[0],
      shardCount: this.client.options.shardCount || 1
    })
      .then((data) => this.emit('posted', data))
      .catch(err => console.error(err))
  }
}