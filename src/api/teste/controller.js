import {
  response
} from "express";
import request from "request";
import fs from "fs";
var SpotifyWebApi = require('spotify-web-api-node');

export const ping = (req, res, next) =>
  res.status(200).json({
    pong: true
  })

export const narcissistic = ({params}, res, next) => {
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
export const music = ({params}, res, next) => {
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

export const sales = ({query}, res, next)=>{
  fs.readFile('./misc/dados.json', (err, data)=>{
    if(err) res.status(500).json(err)
    let sales = JSON.parse(data).filter(sale=>{
      //?Foi mal, manipular data em js é um inferno sem o momentjs. ficou com péssima legibilidade.
      let saleDate = new Date(sale.data.substr(6,4) + '-' + sale.data.substr(3,2) + '-' + sale.data.substr(0,2)).getTime(),
        saleDateFrom = new Date(query.inicio).setHours(0,0,0,0),
        saleDateTo = new Date(query.fim).setHours(23,59,59,999)
      return (saleDate >= saleDateFrom && saleDate <= saleDateTo)
    })
    const groupBy = key => array =>
      array.reduce((objectsByKeyValue, obj) => {
        const value = obj[key];
        objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
        return objectsByKeyValue;
      }, {});
      let salesByDate = groupBy('data')
      
      let items = [{
        other:{},
        sellers:[],
        data:''
      }]
    
      sales.map(function(sale){
        if (sale.cpf !== null) {
          sale.sales = sale.quantidade_vendas
          sale.items = sale.quantidade_pecas
          sale.sold = parseFloat(sale.valor_vendas).toFixed(2)
          // items[0].date = new Date(sale.data).toISOString()
          //? não vejo necessidade de deletar mas aí vai:
          delete sale.quantidade_vendas
          delete sale.quantidade_pecas
          delete sale.valor_vendas
          // delete sale.data
          delete sale.nome
          delete sale.codigo
        }else{
          sale.sales = sale.quantidade_vendas
          sale.items = sale.quantidade_pecas
          sale.sold = parseFloat(sale.valor_vendas).toFixed(2)
        }
        // else items.other
        return sale
      })

      const itemsByDate = salesByDate(sales)
      // console.log(itemsByDate);
      let sellersArr=[], otherArr=[]
      for(const date in itemsByDate ) {
        if(itemsByDate[date].cpf === null)
        otherArr.push(itemsByDate[date]) 
        else
        sellersArr.push(itemsByDate[date])

        
      }
      items.push({other: otherArr, sellers:sellersArr, date:'getDATA'})
      // let sellers = sales
     /*  sales.map(function(sale){
        sale.sales = sale.quantidade_vendas
        delete sale.quantidade_vendas
        sale.items = sale.quantidade_pecas
        delete sale.quantidade_pecas
        sale.sold = parseFloat(sale.valor_vendas).toFixed(2)
        delete sale.valor_vendas
        //? não vejo necessidade de deletar mas aí vai:
        delete sale.data
        delete sale.nome
        delete sale.codigo
        return sale
      }) */
        // console.log(a,b,c);
        /* let item = {}
        item.other = {
          sales: 0,
           items:0,
            sold: 0.0
        }
        item.sellers = []
        if(el.cpf===null){
          item.other.sales += Number(el.quantidade_vendas)
          item.other.items += Number(el.quantidade_pecas)
          item.other.sold += parseFloat(el.valor_vendas).toFixed(2)
        } */
      // })
      
    // let obj = {
    //   items: [
    //     {
    //       other: {sales: 0,items: 0,sold: 0.0},
    //       sellers: [],
    //       date: null
    //     }
    //   ] 
    // }
    // for (const [i,sale] of sales.entries()) {
    //   let saleObj = {}
    //   // /* if(sale.cpf === null) {
    //     saleObj.sales += Number(sale.quantidade_vendas)
    //     saleObj.items += Number(sale.quantidade_pecas)
    //     saleObj.sold += parseFloat(sale.valor_vendas)
    //     obj.items[i].push(saleObj)
    //   } else { */
    //     // obj.items[i].sellers = {}
    //     let item =  {}
    //     item.cpf = sale.cpf
    //     item.items = Number(sale.quantidade_pecas)
    //     item.sales = Number(sale.quantidade_vendas)
    //     item.sold = parseFloat(sale.valor_vendas).toFixed(2)
    //     item.date = new Date(sale.data.substr(6,4) + '-' + sale.data.substr(3,2) + '-' + sale.data.substr(0,2)).toISOString()

    //     console.log(item);
        // obj.items.push(sellers[item])
      // }
      // obj.items.date = new Date(sale.data.substr(6,4) + '-' + sale.data.substr(3,2) + '-' + sale.data.substr(0,2)).toISOString()
    // }
    res.status(200).json(items)
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
