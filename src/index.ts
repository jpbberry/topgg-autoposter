import './typings'

import DJSPoster from './structs/DJSPoster'
import ErisPoster from './structs/ErisPoster'
import DJSSharderPoster from './structs/DJSSharderPoster'
import { BasePoster } from './structs/BasePoster'

/**
 * Create an AutoPoster
 * @param token Top.gg Token
 * @param client Your Discord.js/Eris Client or Discord.js ShardingManager
 * @param options Options
 * @example
 * const AutoPoster = require('topgg-autoposter')
 * 
 * AutoPoster('topggtoken', client) // that's it!
 */
function AutoPoster (token: string, client: any, options?: PosterOptions): BasePoster {
  if (!token) throw new Error('Token is missing')
  if (!client) throw new Error('Client is missing')
  let DiscordJS
  try {
    DiscordJS = require.cache[require.resolve('discord.js')]
  } catch (err) {}
    
  let Eris
  try {
    Eris = require.cache[require.resolve('eris')]
  } catch (err) {}

  if (DiscordJS && client instanceof DiscordJS.exports.Client) return new DJSPoster(token, client, options)
  if (Eris && client instanceof Eris.exports.Client) return new ErisPoster(token, client, options)
  if (DiscordJS && client instanceof DiscordJS.exports.ShardingManager) return new DJSSharderPoster(token, client, options)

  throw new Error('Unsupported client')
}

AutoPoster.DJSPoster = DJSPoster
AutoPoster.ErisPoster = ErisPoster
AutoPoster.DJSSharderPost = DJSSharderPoster

export default AutoPoster