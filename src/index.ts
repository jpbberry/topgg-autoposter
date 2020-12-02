import './typings'

import DJSPoster from './structs/DJSPoster'
import ErisPoster from './structs/ErisPoster'

function AutoPoster (token: string, client: any, options?: PosterOptions) {
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

  throw new Error('Unsupported client')
}

AutoPoster.DJSPoster = DJSPoster
AutoPoster.ErisPoster = ErisPoster

export default AutoPoster