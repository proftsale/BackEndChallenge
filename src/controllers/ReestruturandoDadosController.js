const vendasJson = require("./../data/dados.json");
const sortByDate = require("./../utils/sortByDate");
const convertDateToObject = require("./../utils/convertDateToObject");
const filterSalesByDate = require("./../utils/filterSalesByDate");

module.exports = {
  async index(request, response) {
    const { inicio, fim } = request.query;

    try {
      regexDate = /^(19[5-9][0-9]|20[0-4][0-9]|2050)[-/](0?[1-9]|1[0-2])[-/](0?[1-9]|[12][0-9]|3[01])$/;
    if (!regexDate.test(inicio) || !regexDate.test(fim)) {
      response.status(400);
      return response.json({ errorMessage: "Invalid date format" });
    }

    vendas = vendasJson;

    vendasOrdenadas = sortByDate(vendas);
    vendasFiltradas = filterSalesByDate(vendasOrdenadas, inicio, fim);

    vendasPorData = [];

    vendasFiltradas.map((venda, index, array) => {
      let pos = vendasPorData.findIndex((item) => +item.date === +venda.data);

      hasCPF = !(!venda.cpf || 0 === venda.cpf);
      seller = {};
      other = {};
      if (hasCPF) {
        seller = {
          cpf: venda.cpf,
          sales: venda.quantidade_vendas,
          items: venda.quantidade_pecas,
          sold: venda.valor_vendas,
        };
      } else {
        other = {
          sales: venda.quantidade_vendas,
          items: venda.quantidade_pecas,
          sold: venda.valor_vendas,
        };
      }

      if (pos === -1) {
        if (hasCPF)
          vendasPorData = [
            ...vendasPorData,
            { other: {}, sellers: [seller], date: venda.data },
          ];
        else
          vendasPorData = [
            ...vendasPorData,
            { other: other, sellers: [], date: venda.data },
          ];
      } else {
        if (hasCPF)
          vendasPorData[pos] = {
            ...vendasPorData[pos],
            sellers: [...vendasPorData[pos].sellers, seller],
          };
        else {
          vendasPorData[pos] = {
            ...vendasPorData[pos],
            other: {
              sales: vendasPorData[pos].other.sales
                ? vendasPorData[pos].other.sales + other.sales
                : other.sales,
              items: vendasPorData[pos].other.items
                ? vendasPorData[pos].other.items + other.items
                : other.items,
              sold: vendasPorData[pos].other.sold
                ? vendasPorData[pos].other.sold + other.sold
                : other.sold,
            },
          };
        }
      }
    });

    successMessage = {
      items: vendasPorData,
    };

    return response.json(successMessage);
    } catch (error) {
      console.log(error);
      
      return response.status(500).json({errorMessage: error.message});
    }
    
  },
};
