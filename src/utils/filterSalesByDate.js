const converDateToObject = require('./convertDateToObject')

module.exports = function filterSalesByDate(sales, inicio, fim) {
  inicio = new Date(inicio)
  fim = new Date(fim)
  return sales.filter(sale => sale.data >= inicio && sale.data <= fim)
}