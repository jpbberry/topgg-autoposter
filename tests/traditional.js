const { Client } = require('discord.js')

const client = new Client()

const { Api } = require('@top-gg/sdk')
const api = new Api('abc')
api._request = (method, path, body) => {
  console.log(method, path, body)
}

const AutoPoster = require('..')
AutoPoster('abc', client, {
  sdk: api
})

client.login()