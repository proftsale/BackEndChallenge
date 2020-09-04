# Desafio Back-end

Show! Seja bem-vindo(a) ao nosso desafio de back-end, e divirta-se 😜.

Nesse desafio iremos desenvolver um servidor express, com algumas rotas que deverão conter a solução para as quests.
Você deverá fazer um fork desse projeto, e ao final, enviar um PR para este repositório.

## 1ª Quest - *Ping-pong*
Para começarmos, primeiro temos que preparar nosso servidor. Inicialize um projeto contendo a biblioteca express que responda à seguinte requisição:

**GET** */v1/ping*

`{
  pong: true
  }`
  
## 2ª Quest - *Número narcisista*
Agora que já temos o servidor configurado e funcionando, vamos para o primeiro desafio de fato: 
Um número narcisista é aquele que a soma dos seus dígitos elevada a quantidade de dígitos é igual ao número inicial.
Exemplo:

**153:**
` 1^3 + 5^3 + 3^3 = 1 + 125 + 27 = 153`

**1634:**
`1^4 + 6^4 + 3^4 + 4^4 = 1 + 1296 + 81 + 256 = 1634`

Para resolvermos esse problema, será criada uma rota que recebe o número e retorna se ele é narcisista ou não:

**GET** */v1/narcisista/1634*

`{
  result: true
  }`

## 3ª Quest - *Qual é a música?*
Aqui na Proft nós estamos constantemente lidando com integrações, contendo diversos tipos de respostas e estruturas de dados. Nessa quest iremos testar sua habilidade no consumo de API's, em que uma delas será a do Spotify.
O desafio consiste em receber uma coordenada específica, e baseada na temperatura do local naquele momento, retornar qual é a melhor e mais popular música para se tocar.

- Se estiver entre 0˚C e 15˚C, tocar *Blues*
- Entre 16˚C e 30˚C, *POP*
- Mais de 30˚C, *Música Eletrônica*

Exemplo:

**GET** */v1/musica/-23.4273,-51.9375*

`{
  name: "Pumped Up Kicks",
  url: "https://open.spotify.com/track/7w87IxuO7BDcJ3YUqCyMTT"
  }`

## 4ª Quest - *Reestruturando dados*
Esse será o último desafio, e se trata de um dos casos que lidamos no dia-a-dia aqui na proft, pois nem sempre o retorno das informações dos nossos integradores estão no formato ideal. Este repositório contém um arquivo chamado **aux/dados.json**, na qual consiste em um array de vendas de vendedores.
Para resolver essa quest, você deverá reorganizar esses dados na seguinte estrutura:
* Data  (ISO 8601) (String)
* Vendedores (Array de objetos)
  * CPF do Vendedor (String)
  * Quantidade de vendas do vendedor (Inteiro)
  * Quantidade de peças vendidas pelo vendedor (Inteiro)
  * Total vendido (Float)
* Outras vendas (Vendas sem CPF) (Objeto)
  * Quantidade de outras vendas (Inteiro)
  * Quantidade de peças (Inteiro)
  * Total vendido (Float)

- As vendas que não contém CPF deverão ser contabilizadas dentro de outras vendas.
- O retorno será uma lista de objetos que corresponderá aos dias de vendas dentro do intervalo requerido.

Exemplo:

**GET** */v1/vendas/?inicio=2020-01-01&fim=2020-01-02

Retorno:
![Exemplo] (/aux/exemplo.png)

### Boas práticas desejáveis
- Quebrar suas soluções em commits, conforme for avançando na resolução dos desafios. Para podermos acompanhar como seu desenvolvimento evolui.
- Centralizar informações sensíveis em um arquivo .env;
- Ter em mente a escalabilidade do código, e como ele vai se comportar em um ambiente de alta demanda de requisições;
- Qualidade do código, sempre pensar no amiguinho que pode trabalhar no seu código depois;
- Eficiência do código. O interessante é sempre que possível termos uma abordagem mais leve para a solução de problemas, isso aumentará a velocidade de resposta do seu back-end;
- Tolerar falhas: Muitas vezes o usuário pode fornecer valores que não são o que estamos esperando. O Servidor deverá responder de acordo, caso não receba o que esperava.