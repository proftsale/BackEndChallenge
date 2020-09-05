module.exports = {
  async index(request, response) {
    successMessage = {
      pong: true,
    };

    return response.json(successMessage);
  },
};
