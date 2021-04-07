import DJSPoster from './structs/DJSPoster'
import ErisPoster from './structs/ErisPoster'
import DJSSharderPoster from './structs/DJSSharderPoster'
import RosePoster from './structs/RosePoster'

import { BasePoster } from './structs/BasePoster'

import { PosterOptions } from './typings'

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
  if (!token) throw new Error('Top.gg token is missing')
  if (!client) throw new Error('Client is missing')
  let DiscordJS
  try {
    DiscordJS = require.cache[require.resolve('discord.js')]
  } catch (err) {}
    
  let Eris
  try {
    Eris = require.cache[require.resolve('eris')]
  } catch (err) {}

  let DR
  try {
    DR = require.cache[require.resolve('discord-rose')]
  } catch (err) {}

  if (DiscordJS && client instanceof DiscordJS.exports.Client) return new DJSPoster(token, client, options)
  if (Eris && client instanceof Eris.exports.Client) return new ErisPoster(token, client, options)
  if (DiscordJS && client instanceof DiscordJS.exports.ShardingManager) return new DJSSharderPoster(token, client, options)
  if (DR && client instanceof DR.exports.Master) return new RosePoster(token, client, options)

  throw new Error('Unsupported client')
}

AutoPoster.DJSPoster = DJSPoster
AutoPoster.ErisPoster = ErisPoster
AutoPoster.DJSSharderPost = DJSSharderPoster
AutoPoster.RosePoster = RosePoster

export default AutoPoster