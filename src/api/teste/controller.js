import {
  response
} from "express";
import request from "request";
var SpotifyWebApi = require('spotify-web-api-node');

export const ping = ({
    body
  }, res, next) =>
  res.status(200).json({
    pong: true
  })

export const narcissistic = ({
  params
}, res, next) => {
  /* não estou checando o type, só para deixar simples.
  sem o TS chegar tipo do param vai ficar bagunçado aqui no controller
  (especialmente pelo codigo estar no corpo desse controller geral.) */
  let nar = params.number
  let str = nar.toString(),
    sum = 0,
    l = str.length;
  if (nar < 0) {
    res.status(422).end()
  } else {
    for (let i = 0; i < l; i++) {
      sum += Math.pow(str.charAt(i), l)
    }
  }
  let result = sum == nar
  res.status(200).json(result)
}
export const music = ({
  params
}, res, next) => {
  let coordinates = params.coord.split(',')
  var spotifyResponseSong = {}
  request(
    //@TODO ERROR handling
    `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates[0]}&lon=${coordinates[1]}&units=metric&appid=${process.env['OW_KEY']}`,
    {json: true},
    function (err, mapRes, body) {
      var clientId = process.env['SPTF_CLIENT_ID'],
        clientSecret = process.env['SPTF_CLIENT_SECRET'],
        spotifyApi = new SpotifyWebApi({
          clientId: clientId,
          clientSecret: clientSecret
        })
      spotifyApi.clientCredentialsGrant()
        .then(function (data) {
          let genre

          //feioso isso, ideal era uma função que retornasse o gênero dada uma temp
          spotifyApi.setAccessToken(data.body['access_token'])
          if (body.main.temp > 30) {
            genre = 'electronic'
          } else
          if (body.main.temp >= 0 && body.main.temp <= 15) {
            genre = 'blues'
          } else
          if (body.main.temp >= 16 && body.main.temp <= 30) {
            genre = 'pop'
          }
          /*
          gamb pq o spotify não tem listagem de msuicas por gênero na api.
           nem top tracks. tenho como receber o top50 (playlist automatica do spotify) 
           e com ela fazer um filter de gênero, mas certamente na top 50 não vai ter blues, por exemplo.
           */
          spotifyApi
            .searchTracks(
              `genre:${genre}`, {
                limit: 10
              })
            .then(function (sptfRes) {
              let song = sptfRes.body.tracks.items[Math.floor(Math.random() * 10)]

              spotifyResponseSong.name = song.name
              spotifyResponseSong.url = song.external_urls.spotify
            }).then(x => {
              res.status(200).json(spotifyResponseSong)
            })
        })
    })
}

export const create = ({
    body
  }, res, next) =>
  res.status(201).json(body)

export const index = ({
    querymen: {
      query,
      select,
      cursor
    }
  }, res, next) =>
  res.status(200).json([])

export const show = ({
    params
  }, res, next) =>
  res.status(200).json({})

export const update = ({
    body,
    params
  }, res, next) =>
  res.status(200).json(body)

export const destroy = ({
    params
  }, res, next) =>
  res.status(204).end()
