module.exports = function convertDateToObject(data) {
  DateParts = data.split("/");
  return new Date(
    new Date(+DateParts[2], DateParts[1] - 1, +DateParts[0]).setUTCHours(
      0,
      0,
      0,
      0
    )
  );
};
