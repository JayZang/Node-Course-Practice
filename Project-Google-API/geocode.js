const request = require('request');

const API_ROOT_URL = 'http://maps.googleapis.com/maps/api/geocode/json';

const geocodeAddress = (address) => {
  var queryUri = API_ROOT_URL + '?address=' + encodeURIComponent(address);

  return new Promise((resolve, reject) => {
    request({
      url: queryUri,
      method: 'GET',
      json: true
    }, (err, res, body) => {
      if( err ){
        reject('Unable to connect to Google server.');
      } else if( body.status === 'ZERO_RESULTS' ){
        reject('Unable to find that address');
      } else if( body.status === 'OK' ){
        resolve({
          address: body.results[0].formatted_address,
          lat: body.results[0].geometry.location.lat,
          lng: body.results[0].geometry.location.lng
        });
      } else {
        reject('Something Wrong');
      }
    })
  })
}

module.exports = {
  geocodeAddress
}
