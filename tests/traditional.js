const { Client } = require('discord.js')

const client = new Client()

const AutoPoster = require('..')
AutoPoster('${topggToken}', client)

client.login()