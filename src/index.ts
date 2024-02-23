import { DJSPoster } from './structs/DJSPoster'
import { ErisPoster } from './structs/ErisPoster'
import { DJSSharderPoster } from './structs/DJSSharderPoster'
import { RosePoster } from './structs/RosePoster'
import { OceanicPoster } from './structs/OceanicPoster'
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
export function AutoPoster(token: string, client: any, options?: PosterOptions): BasePoster {
  if (!token) throw new Error('Top.gg token is missing')
  if (!client) throw new Error('Client is missing')
  let DiscordJS
  try {
    DiscordJS = require.cache[require.resolve('discord.js')]
  } catch (err) { }

  let Eris
  try {
    Eris = require.cache[require.resolve('eris')]
  } catch (err) { }

  let DR
  try {
    DR = require.cache[require.resolve('discord-rose')]
  } catch (err) { }

  let Oceanic
  try {
    Oceanic = require.cache[require.resolve('oceanic.js')]
  } catch (err) { }

  if (Oceanic && client instanceof Oceanic.exports.Client) return new OceanicPoster(token, client, options)
  if (DiscordJS && client instanceof DiscordJS.exports.Client) return new DJSPoster(token, client, options)
  if (Eris && client instanceof Eris.exports.Client) return new ErisPoster(token, client, options)
  if (DiscordJS && client instanceof DiscordJS.exports.ShardingManager) return new DJSSharderPoster(token, client, options)
  if (DR && client instanceof DR.exports.Master) return new RosePoster(token, client, options)

  throw new Error('Unsupported client')
}

export { DJSPoster } from './structs/DJSPoster'
export { ErisPoster } from './structs/ErisPoster'
export { DJSSharderPoster } from './structs/DJSSharderPoster'
export { RosePoster } from './structs/RosePoster'
export { OceanicPoster } from './structs/OceanicPoster'

export default AutoPoster
