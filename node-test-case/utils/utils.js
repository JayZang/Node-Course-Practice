module.exports.add = (a, b) => {
  return a + b;
}

module.exports.square = (a) => {
  return a * a;
}

module.exports.asyncAdd = (a, b, callback) => {
  setTimeout(() => {
    return callback(a + b);
  }, 1000)
}
