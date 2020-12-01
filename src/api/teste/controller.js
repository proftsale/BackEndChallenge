import request from "request";
import fs from "fs";
var SpotifyWebApi = require('spotify-web-api-node');

export const ping = (req, res) =>
  res.status(200).json({
    pong: true
  })

export const narcissistic = ({params}, res) => {
  if (Number(params.number)) {
    let nar = params.number
    let str = nar.toString(),
      sum = 0,
      l = str.length
    if (nar < 0) {
      res.status(422).end("Can't process numbers that are less than 0")
    } else {
      for (let i = 0; i < l; i++) {
        sum += Math.pow(str.charAt(i), l)
      }
    }
    let result = sum == nar
    res.status(200).json(result)
  } else {
    res.status(422).end('Wrong type')
  }
  
}
export const music = ({params}, res) => {
  let coordinates = params.coord.split(',')
  //fault tolerance, precisa ser 2 cordenadas, numeros (não necessariamente float)
  if (coordinates.length != 2 || typeof Number(coordinates[0]) != "number" || typeof Number(coordinates[1]) != "number")
      return res.status(422).end("Coordinates must be comma separated float")
  var spotifyResponseSong = {}
  request(
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
            }).then(() => {
              res.status(200).json(spotifyResponseSong)
            })
        })
    })
}

export const sales = ({query}, res)=>{
  fs.readFile('./misc/dados.json', (err, data) => {
    if (err) res.status(500).json(err)
    let sales = JSON.parse(data).filter(sale => {
      //?Foi mal, manipular data em js é um inferno sem o momentjs. ficou com péssima legibilidade.
      let saleDate = new Date(sale.data.substr(6, 4) + '-' + sale.data.substr(3, 2) + '-' + sale.data.substr(0, 2)).getTime(),
        saleDateFrom = new Date(query.inicio).setHours(0, 0, 0, 0),
        saleDateTo = new Date(query.fim).setHours(23, 59, 59, 999)
      return (saleDate >= saleDateFrom && saleDate <= saleDateTo)
    })
    const groupBy = key => array =>
      array.reduce((objectsByKeyValue, obj) => {
        const value = obj[key];
        objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
        return objectsByKeyValue;
      }, {});
    let salesByDate = groupBy('data')

    sales.map(sale => {
      if (sale.cpf !== null) {
        sale.sales = Number(sale.quantidade_vendas)
        sale.items = Number(sale.quantidade_pecas)
        sale.sold = parseFloat(sale.valor_vendas)
      } else {
        sale.sales = Number(sale.quantidade_vendas)
        sale.items = Number(sale.quantidade_pecas)
        sale.sold = parseFloat(sale.valor_vendas)
      }
      return sale
    })

    const itemsByDate = salesByDate(sales)
    // console.log(itemsByDate);
    let itemsArr = []
    for (const date in itemsByDate) {
      let tmpObj = {
        other: {
          sales: 0,
          items: 0,
          sold: parseFloat(0.00)
        },
        sellers: []
      }
      tmpObj.date = new Date(date.substr(6, 4) + '-' + date.substr(3, 2) + '-' + date.substr(0, 2)).toISOString()
      itemsByDate[date].forEach(function (sale) {
        if (sale.cpf != null)
          tmpObj.sellers.push(sale);
        else {
          tmpObj.other.sales += Number(sale.sales)
          tmpObj.other.items += Number(sale.items)
          tmpObj.other.sold += parseFloat(sale.sold)
          delete tmpObj.other.cpf
        }
        delete sale.data;
        delete sale.quantidade_vendas
        delete sale.quantidade_pecas
        delete sale.valor_vendas
        delete sale.nome
        delete sale.codigo
      });
      itemsArr.push(tmpObj)
    }
    res.status(200).json({
      items: itemsArr
    })
  })
}

export const create = ({
    body
  }, res) =>
  res.status(201).json(body)

export const index = ({
  }, res) =>
  res.status(200).json([])

export const show = ({
  }, res) =>
  res.status(200).json({})

export const update = ({
    body  }, res) =>
  res.status(200).json(body)

export const destroy = ({
  }, res) =>
  res.status(204).end()
