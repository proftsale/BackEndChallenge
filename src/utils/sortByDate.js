const convertDateToObject = require("./convertDateToObject");

module.exports = function sortByDate(vendas) {
  vendas = vendas.map((venda) => ({
    ...venda,
    data: convertDateToObject(venda.data),
  }));
  return vendas.sort(function (a, b) {
    dataA = a.data;
    dataB = b.data;

    return dataA - dataB;
  });
};
