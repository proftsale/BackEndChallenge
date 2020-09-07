module.exports = {
  async index(request, response) {
    try {
      successMessage = {
        pong: true,
      };

      return response.json(successMessage);
    } catch (error) {
      console.log(error);
      return response.status(500).json(error.message);
    }
  },
};
