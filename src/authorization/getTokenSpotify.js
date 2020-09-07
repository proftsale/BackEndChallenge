const axios = require("axios");
const qs = require("qs");

async function getTokenSpotify() {
  try {
    let urlGetToken = "https://accounts.spotify.com/api/token";

    let encoded64credencials = process.env.SPOTIFY_AUTHORIZATION;

    let response = await axios
      .post(
        urlGetToken,
        qs.stringify({
          grant_type: "client_credentials",
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${encoded64credencials}`,
          },
        }
      )
      .then((response) => response.data.access_token);

      return response;
  } catch (error) {
    console.log(error.message);
    return process.env.SPOTIFY_API_TOKEN;
  }
};

module.exports = getTokenSpotify