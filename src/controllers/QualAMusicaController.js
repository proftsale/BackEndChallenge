const axios = require('axios');

module.exports = {
  async index(request, response) {
    const { localizacao } = request.params;

    const [ latitude, longitude ] = localizacao.split(',');

    // Store in env
    apiKey = "6c59165fc45efba23ec80cab85486e5c"

    weatherApiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}` 

    temperaturaKelvin = await axios.get(weatherApiURL).then(response => response.data.main.temp)

    temperaturaCelcius = temperaturaKelvin - 273.15

    successMessage = {
        pong: temperaturaCelcius
    }

    return response.json(successMessage);
  },

};