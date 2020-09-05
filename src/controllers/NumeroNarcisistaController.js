module.exports = {
  async index(request, response) {
    const { numero } = request.params;

    tamanhoNumero = numero.length;

    digitos = [...numero];

    digitosElevados = digitos.map((num) => Math.pow(num, tamanhoNumero));

    somaDigitos = digitosElevados.reduce((num1, num2) => num1 + num2);

    isNarcisista = somaDigitos == numero;

    successMessage = {
      result: isNarcisista,
    };

    return response.json(successMessage);
  },
};
