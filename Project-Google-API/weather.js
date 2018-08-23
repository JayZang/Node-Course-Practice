const request = require('request');

const API_KEY = 'b06d5c291d95505ee9ecd82d5ca0163f';
const API_ROOT_URL = 'https://api.darksky.net/forecast';

const getWeather = (lat, lng) => {
  let queryUrl = API_ROOT_URL + '/' + API_KEY + `/${lat},${lng}`;

  return new Promise((resolve, reject) => {
    request({
      url: queryUrl,
      json: true
    }, (err, res, body) => {
      if(err)
        reject('Unable to connect to server');
      else if(res.statusCode === 400)
        reject('Page not found')
      else
        resolve({
          temperature: body.currently.temperature,
          apparentTemperature: body.currently.apparentTemperature
        })
    })
  })
}

module.exports = {
  getWeather
}
