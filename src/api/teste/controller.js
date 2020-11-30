export const ping = ({ body }, res, next) =>
  res.status(200).json({pong: true})

  export const narcissistic = ({ params }, res, next) =>{
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

export const create = ({ body }, res, next) =>
  res.status(201).json(body)

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  res.status(200).json([])

export const show = ({ params }, res, next) =>
  res.status(200).json({})

export const update = ({ body, params }, res, next) =>
  res.status(200).json(body)

export const destroy = ({ params }, res, next) =>
  res.status(204).end()
