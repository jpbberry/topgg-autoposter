import { EventEmitter } from 'events'
import { Api } from '@top-gg/sdk'

import { BotStats } from '@top-gg/sdk/dist/typings'

import { PosterOptions } from '../typings'

export interface BasePosterInterface {
  getStats: () => Promise<BotStats>
  clientReady: () => boolean | Promise<boolean>
  waitForReady: (fn: () => void) => void
}

export interface BasePoster {
  on(event: 'posted', listener: (stats) => void)
}

export class BasePoster extends EventEmitter {
  private options: PosterOptions
  private binds: BasePosterInterface
  private api: Api

  public started: boolean
  public interval: NodeJS.Timeout

  constructor (token: string, options?: PosterOptions) {
    super()
    this.options = options
    this.started = false

    if (!options) options = {}

    this.options = {
      interval: options.interval ?? 1800000,
      postOnStart: options.postOnStart ?? true,
      startPosting: options.startPosting ?? true,
      sdk: options.sdk
    }

    if (this.options.interval < 900000) {
      throw new Error('Posting interval must be above 900000 (15 minutes)')
    }

    this.api = this.options.sdk || new Api(token)
  }

  public async _binder (binds: BasePosterInterface) {
    this.binds = binds

    if (this.options.startPosting) {
      if (await this.binds.clientReady()) this.start()
      else this.binds.waitForReady(() => {
        this.start()
      })
    }
  }

  /**
   * Start the posting
   */
  public start () {
    this.started = true
    this._setupInterval()
  }

  /**
   * Stop the posting
   */
  public stop () {
    this.started = false
    clearInterval(this.interval)

    this.interval = null
  }

  private _setupInterval () {
    if (this.options.postOnStart) {
      setTimeout(() => {
        this.post()
      }, 5000)
    }
    this.interval = setInterval(async () => {
      if (!(await this.binds.clientReady())) return
      this.post()
    }, this.options.interval)
  }

  public async post () {
    this.api.postStats(await this.binds.getStats())
      .then((data) => this.emit('posted', data))
      .catch(err => console.error(err))
  }
}