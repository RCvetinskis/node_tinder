module.exports = (res, message, error, data) => {
  return res.send({ message, error, data: data ? data : null });
};
