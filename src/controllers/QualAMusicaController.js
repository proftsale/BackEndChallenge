const axios = require("axios");
const getTokenSpotify = require('../authorization/getTokenSpotify');

module.exports = {
  async index(request, response) {
    const { localizacao } = request.params;

    const [latitude, longitude] = localizacao.split(",");
    try {
      regexGeolocation = /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/;
      if (!regexGeolocation.test(localizacao.toString())) {
        response.status(400);
        return response.json({ errorMessage: "Invalid geolocation format" });
      }
      let weatherApiKey = process.env.WEATHER_API_KEY;
      let spotifyApiKey = await getTokenSpotify();

      let weatherApiURL = `http://api.weatherstack.com/current?query=${latitude},${longitude}&access_key=${weatherApiKey}`;

      let temperature = await axios
        .get(weatherApiURL)
        .then((response) => response.data.current.temperature)
        
      if (temperature > 0 && temperature <= 15) categoria = "blues";
      else if (temperature > 15 && temperature <= 30) categoria = "pop";
      else if (temperature > 30) categoria = "edm_dance";
      else
        return response.json({ message: "Na Antártica não se escuta música" });

      let spotifyBaseApiURL = `https://api.spotify.com/v1/`;

      playlistHypada = await axios
        .get(spotifyBaseApiURL + `browse/categories/${categoria}/playlists`, {
          headers: {
            Authorization: `Bearer ${spotifyApiKey}`,
          },
        })
        .then((response) => response.data.playlists.items[0].id)
      
      musicasPlaylist = await axios
        .get(
          spotifyBaseApiURL +
            `playlists/${playlistHypada}/tracks?fields=items(track(name,popularity,external_urls))`,
          {
            headers: {
              Authorization: `Bearer ${spotifyApiKey}`,
            },
          }
        )
        .then((response) => response.data.items)

      melhorMusica = musicasPlaylist[0].track;

      musicasPlaylist.map(({ track }, index) => {
        if (track.popularity > melhorMusica.popularity) melhorMusica = track;
      });

      successMessage = {
        name: melhorMusica.name,
        url: melhorMusica.external_urls.spotify,
      };

      return response.json(successMessage);
    } catch (error) {
      console.log(error.message);
      if(error.message.includes("401"))
        error.message = "Atualize o token do spotify!";

      return response.status(500).json({errorMessage: error.message});
    }
  },
};
